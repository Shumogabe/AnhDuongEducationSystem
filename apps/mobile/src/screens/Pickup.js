import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { addDays, diaryFor, DOW, dowOf, fmtDate, hash, isDate, isPhone, KIDS, TODAY } from '../data';
import { useApp } from '../store';
import { colors } from '../theme';
import { Badge, Btn, Card, Empty, Field, Note, Row, Screen, Select, Sheet, useTick, useToast } from '../ui';

const QR_SECONDS = 60;
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const randomToken = (len) => Array.from({ length: len }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join('');
const newToken = () => `AD-${randomToken(10)}`;

/* ===== Tab Đón trả ===== */
export function Pickup() {
  const { kid, data } = useApp();
  const nav = useNavigation();
  const [token, setToken] = useState(newToken);
  const [left, setLeft] = useState(QR_SECONDS);
  const k = KIDS[kid];
  const pickers = data.pickers[kid];
  const pending = data.leaves.filter((l) => l.kid === kid && l.status === 'Chờ xác nhận').length;
  const days = Array.from({ length: 5 }, (_, i) => addDays(TODAY, -i)).filter((iso) => diaryFor(kid, iso));

  const tick = useCallback(() => {
    setLeft((v) => {
      if (v <= 1) { setToken(newToken()); return QR_SECONDS; }
      return v - 1;
    });
  }, []);
  useTick(1000, tick);

  return (
    <Screen>
      <Text style={{ fontSize: 16, fontWeight: '700', color: colors.dark }}>Đón trả</Text>
      <Card title={`Mã QR đón ${k.name}`}>
        <View style={{ alignItems: 'center', gap: 10 }}>
          <View style={s.qrBox}><QRCode value={token} size={176} color={colors.dark} backgroundColor={colors.white} /></View>
          <Text style={{ fontSize: 12, color: colors.gray, textAlign: 'center' }}>Đưa mã này cho cô khi đón bé. Mã đổi sau <Text style={{ fontWeight: '700', color: colors.primary }}>{left}</Text> giây và chỉ dùng một lần.</Text>
          <View style={s.track}><View style={[s.fill, { width: `${(left / QR_SECONDS) * 100}%` }]} /></View>
        </View>
      </Card>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Pressable onPress={() => nav.navigate('People')} accessibilityRole="button" style={s.tile}><Ionicons name="people" size={22} color={colors.primary} /><Text style={s.tileT}>Người được đón</Text><Text style={s.tileS}>{pickers.length} người</Text></Pressable>
        <Pressable onPress={() => nav.navigate('Codes')} accessibilityRole="button" style={s.tile}><Ionicons name="ticket" size={22} color={colors.gold} /><Text style={s.tileT}>Đón hộ</Text><Text style={s.tileS}>Mã tạm thời</Text></Pressable>
      </View>
      <Row icon="calendar-clear" iconTone="yellow" title="Xin nghỉ" sub={`${pending} đơn chờ xác nhận`} onPress={() => nav.navigate('Leave')} />
      <Card title="Lịch sử đến / về">
        {days.map((iso, i) => (
          <View key={iso} style={s.hist}>
            <Text style={{ color: colors.dark }}>{DOW[dowOf(iso)]}, {iso.slice(8, 10)}/{iso.slice(5, 7)}</Text>
            <Text style={{ fontSize: 12, color: colors.gray }}>Đến 07:{30 + (hash(iso) % 25)} · {i === 0 ? 'Chưa về' : `Về 16:${10 + (hash(`${iso}v`) % 40)} (${pickers[hash(iso) % pickers.length].rel})`}</Text>
          </View>
        ))}
      </Card>
    </Screen>
  );
}

/* ===== Người được phép đón ===== */
export function People() {
  const { kid, data, update, isMain, phone } = useApp();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ name: '', rel: 'Ông', phone: '' });
  const [errors, setErrors] = useState({});
  const list = data.pickers[kid];
  const save = () => {
    const errs = {};
    if (!f.name.trim()) errs.name = 'Vui lòng nhập họ tên.';
    if (!isPhone(f.phone)) errs.phone = 'Số điện thoại chưa đúng.';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    update('pickers', (p) => ({ ...p, [kid]: [...p[kid], { id: Date.now(), name: f.name.trim(), rel: f.rel, phone: f.phone.replace(/\s/g, '') }] }));
    setOpen(false); setF({ name: '', rel: 'Ông', phone: '' }); toast('Đã thêm người được phép đón');
  };
  const remove = (id) => { update('pickers', (p) => ({ ...p, [kid]: p[kid].filter((x) => x.id !== id) })); toast('Đã xóa người được phép đón'); };
  return (
    <Screen>
      {!isMain && <Note kind="lock">Chỉ Phụ huynh chính được thêm, sửa hoặc xóa người được phép đón.</Note>}
      {list.map((p) => (
        <Row key={p.id} icon="person" title={p.name} sub={`${p.rel} · ${p.phone}`} right={isMain && p.phone !== phone ? <Pressable onPress={() => remove(p.id)} accessibilityRole="button" accessibilityLabel={`Xóa ${p.name}`} style={{ padding: 8 }}><Ionicons name="trash-outline" size={20} color={colors.red} /></Pressable> : null} />
      ))}
      {isMain && <Btn label="Thêm người được đón" kind="primary" icon="add" onPress={() => setOpen(true)} />}
      {open && (
        <Sheet title="Thêm người được đón" onClose={() => setOpen(false)}>
          <Field label="Họ tên" value={f.name} onChangeText={(v) => setF({ ...f, name: v })} error={errors.name} />
          <Select label="Quan hệ với bé" value={f.rel} options={['Bố', 'Mẹ', 'Ông', 'Bà', 'Cô/Dì/Chú/Bác', 'Khác'].map((x) => [x, x])} onChange={(v) => setF({ ...f, rel: v })} />
          <Field label="Số điện thoại" value={f.phone} onChangeText={(v) => setF({ ...f, phone: v })} keyboardType="phone-pad" error={errors.phone} />
          <Text style={{ fontSize: 12, color: colors.gray }}>Người này sẽ nhận lời mời vào app (quyền &quot;Người thân&quot;) qua số điện thoại.</Text>
          <Btn label="Thêm" kind="primary" onPress={save} />
        </Sheet>
      )}
    </Screen>
  );
}

/* ===== Mã đón hộ ===== */
const CODE_TONE = { 'Hiệu lực': 'green', 'Đã dùng': 'gray', 'Hết hạn': 'gray', 'Thu hồi': 'red' };
export function Codes() {
  const { kid, data, update, isMain } = useApp();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ name: '', phone: '' });
  const [errors, setErrors] = useState({});
  const list = data.codes.filter((c) => c.kid === kid);
  const save = () => {
    const errs = {};
    if (!f.name.trim()) errs.name = 'Vui lòng nhập họ tên.';
    if (!isPhone(f.phone)) errs.phone = 'Số điện thoại chưa đúng.';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const code = `${randomToken(4)}-${randomToken(4)}`;
    update('codes', (c) => [{ id: Date.now(), kid, name: f.name.trim(), phone: f.phone.replace(/\s/g, ''), code, status: 'Hiệu lực', date: TODAY }, ...c]);
    setOpen(false); setF({ name: '', phone: '' }); toast(`Đã tạo mã ${code} và gửi tới người đón`);
  };
  const revoke = (id) => { update('codes', (c) => c.map((x) => (x.id === id ? { ...x, status: 'Thu hồi' } : x))); toast('Đã thu hồi mã'); };
  return (
    <Screen>
      <Text style={{ fontSize: 12, color: colors.gray, lineHeight: 18 }}>Dùng khi nhờ người ngoài danh sách đón bé. Người đón không cần tài khoản; mã có hạn trong ngày và dùng một lần. Người đón cần mang giấy tờ để cô đối chiếu.</Text>
      {isMain ? <Btn label="Tạo mã đón hộ" kind="primary" icon="add" onPress={() => setOpen(true)} /> : <Note kind="lock">Chỉ Phụ huynh chính được tạo mã đón hộ.</Note>}
      <Card title="Danh sách mã">
        {list.length === 0 ? <Empty icon="ticket-outline" text="Chưa có mã nào." /> : list.map((c) => (
          <View key={c.id} style={s.code}>
            <View style={s.codeTop}><Text style={{ fontWeight: '700', color: colors.dark }}>{c.name}</Text><Badge label={c.status} tone={CODE_TONE[c.status]} /></View>
            <Text style={{ fontSize: 12, color: colors.gray }}>{c.phone} · {fmtDate(c.date)}</Text>
            {c.status === 'Hiệu lực' && isMain && (
              <View style={s.codeTop}><Text style={{ fontWeight: '700', fontSize: 16, letterSpacing: 2, color: colors.dark }}>{c.code}</Text><Btn label="Thu hồi" kind="danger" small onPress={() => revoke(c.id)} /></View>
            )}
          </View>
        ))}
      </Card>
      {open && (
        <Sheet title="Tạo mã đón hộ" onClose={() => setOpen(false)}>
          <Field label="Họ tên người đón" value={f.name} onChangeText={(v) => setF({ ...f, name: v })} error={errors.name} />
          <Field label="Số điện thoại" value={f.phone} onChangeText={(v) => setF({ ...f, phone: v })} keyboardType="phone-pad" error={errors.phone} hint="Mã sẽ gửi qua Zalo/SMS tới số này." />
          <Text style={{ fontSize: 12, color: colors.gray }}>Mã có hiệu lực hết ngày hôm nay và dùng được một lần.</Text>
          <Btn label="Tạo và gửi mã" kind="primary" onPress={save} />
        </Sheet>
      )}
    </Screen>
  );
}

/* ===== Xin nghỉ ===== */
const LEAVE_TONE = { 'Chờ xác nhận': 'yellow', 'Đã xác nhận': 'green', 'Từ chối': 'red' };
export function Leave() {
  const { kid, data, update, isMain } = useApp();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ from: TODAY, to: TODAY, reason: '' });
  const [errors, setErrors] = useState({});
  const list = data.leaves.filter((l) => l.kid === kid);
  const save = () => {
    const errs = {};
    if (!isDate(f.from) || f.from < TODAY) errs.from = 'Ngày bắt đầu không hợp lệ hoặc ở quá khứ (yyyy-mm-dd).';
    if (!isDate(f.to) || f.to < f.from) errs.to = 'Ngày kết thúc phải sau ngày bắt đầu.';
    if (!f.reason.trim()) errs.reason = 'Vui lòng nhập lý do.';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    update('leaves', (l) => [{ id: Date.now(), kid, from: f.from, to: f.to, reason: f.reason.trim(), status: 'Chờ xác nhận' }, ...l]);
    setOpen(false); setF({ from: TODAY, to: TODAY, reason: '' }); toast('Đã gửi đơn, chờ cô xác nhận');
  };
  return (
    <Screen>
      {isMain ? <Btn label="Tạo đơn xin nghỉ" kind="primary" icon="add" onPress={() => setOpen(true)} /> : <Note kind="lock">Chỉ Phụ huynh chính được gửi đơn xin nghỉ.</Note>}
      <Card title={`Đơn của ${KIDS[kid].name}`}>
        {list.length === 0 ? <Empty icon="calendar-outline" text="Chưa có đơn xin nghỉ." /> : list.map((l) => (
          <View key={l.id} style={s.code}>
            <View style={s.codeTop}><Text style={{ fontWeight: '700', color: colors.dark }}>{fmtDate(l.from)}{l.to !== l.from ? ` - ${fmtDate(l.to)}` : ''}</Text><Badge label={l.status} tone={LEAVE_TONE[l.status]} /></View>
            <Text style={{ fontSize: 12, color: colors.gray }}>{l.reason}</Text>
          </View>
        ))}
      </Card>
      {open && (
        <Sheet title="Đơn xin nghỉ" onClose={() => setOpen(false)}>
          <Field label="Từ ngày (yyyy-mm-dd)" value={f.from} onChangeText={(v) => setF({ ...f, from: v })} error={errors.from} />
          <Field label="Đến ngày (yyyy-mm-dd)" value={f.to} onChangeText={(v) => setF({ ...f, to: v })} error={errors.to} />
          <Field label="Lý do" value={f.reason} onChangeText={(v) => setF({ ...f, reason: v })} multiline placeholder="Ví dụ: bé sốt, về quê..." error={errors.reason} />
          <Btn label="Đính kèm giấy tờ (nếu có)" icon="attach" onPress={() => toast('Chọn tệp đính kèm (demo)')} />
          <Btn label="Gửi đơn" kind="primary" onPress={save} />
        </Sheet>
      )}
    </Screen>
  );
}

const s = StyleSheet.create({
  qrBox: { padding: 12, backgroundColor: colors.white, borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  track: { width: '100%', height: 6, backgroundColor: '#F3F4F6', borderRadius: 3, overflow: 'hidden' },
  fill: { height: 6, backgroundColor: colors.primary },
  tile: { flex: 1, backgroundColor: colors.white, borderRadius: 16, borderWidth: 1, borderColor: colors.line, padding: 14, gap: 4, minHeight: 90 },
  tileT: { fontWeight: '700', color: colors.dark },
  tileS: { fontSize: 12, color: colors.gray },
  hist: { paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: colors.line, gap: 2 },
  code: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.line, gap: 4 },
  codeTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
});
