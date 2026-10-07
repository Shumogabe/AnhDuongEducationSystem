import { useEffect, useState } from 'react';
import { Pressable, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { DAY_LABELS, dowOf, fmtDate, KIDS, menuFor, money, TODAY } from '../data';
import { useApp } from '../store';
import { colors } from '../theme';
import { Badge, Btn, Card, Chips, Empty, Field, Note, Screen, Sheet, useToast } from '../ui';

/* ===== Thực đơn ===== */
export function Menu() {
  const { kid, data } = useApp();
  const [day, setDay] = useState(Math.min(Math.max(dowOf(TODAY) - 1, 0), 4));
  const m = menuFor(kid, day);
  const allergies = data.allergies[kid];
  return (
    <Screen>
      <Text style={{ fontSize: 12, color: colors.gray }}>{KIDS[kid].campus}</Text>
      <Chips items={DAY_LABELS.map((d, i) => [i, d])} value={day} onChange={setDay} />
      <Card>
        {['Bữa sáng', 'Bữa trưa', 'Bữa chiều'].map((l, i) => (
          <View key={l} style={{ paddingVertical: 8, borderBottomWidth: i < 2 ? 1 : 0, borderBottomColor: colors.line }}>
            <Text style={{ fontSize: 12, color: colors.gray }}>{l}</Text>
            <Text style={{ fontWeight: '700', color: colors.dark }}>{m[i]}</Text>
          </View>
        ))}
      </Card>
      {allergies.length > 0 && <Note kind="warn">{`${KIDS[kid].name} có khai báo dị ứng: ${allergies.join(', ')}. Nhà bếp sẽ điều chỉnh khẩu phần riêng.`}</Note>}
    </Screen>
  );
}

/* ===== Thông báo ===== */
export function Notices() {
  const { data } = useApp();
  const nav = useNavigation();
  return (
    <Screen>
      {data.notices.map((n) => (
        <Pressable key={n.id} onPress={() => nav.navigate('Notice', { id: n.id })} accessibilityRole="button" style={{ backgroundColor: colors.white, borderRadius: 16, borderWidth: 1, borderColor: n.read ? colors.line : colors.tint3, padding: 14, flexDirection: 'row', gap: 10 }}>
          <View style={{ width: 10, height: 10, borderRadius: 5, marginTop: 5, backgroundColor: n.read ? '#E5E7EB' : colors.primary }} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: n.read ? '500' : '700', color: colors.dark, lineHeight: 20 }}>{n.title}</Text>
            <Text style={{ fontSize: 12, color: colors.gray, marginTop: 2 }}>{n.scope} · {fmtDate(n.date)}</Text>
          </View>
        </Pressable>
      ))}
    </Screen>
  );
}

export function Notice() {
  const { params } = useRoute();
  const { data, update } = useApp();
  const n = data.notices.find((x) => x.id === params.id);
  // đánh dấu đã đọc khi mở thông báo
  useEffect(() => {
    if (n && !n.read) update('notices', (list) => list.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
  }, [n, update]);
  if (!n) return <Screen><Empty text="Không tìm thấy thông báo." /></Screen>;
  return (
    <Screen>
      <Card>
        <Badge label={n.scope} tone="brand" />
        <Text style={{ fontSize: 17, fontWeight: '700', color: colors.dark, lineHeight: 24 }}>{n.title}</Text>
        <Text style={{ fontSize: 12, color: colors.gray }}>{fmtDate(n.date)}</Text>
        <Text style={{ color: colors.dark, lineHeight: 22, marginTop: 6 }}>{n.body}</Text>
      </Card>
    </Screen>
  );
}

/* ===== Học phí ===== */
const FEE_TONE = { 'Chưa đóng': 'yellow', 'Quá hạn': 'red', 'Đã đóng': 'green' };
function LockedFees() {
  return <Screen><Note kind="lock">Chỉ Phụ huynh chính được xem học phí và biên lai.</Note></Screen>;
}

export function Fees() {
  const { kid, data, isMain } = useApp();
  const nav = useNavigation();
  if (!isMain) return <LockedFees />;
  const list = data.fees[kid];
  const due = list.filter((f) => f.status !== 'Đã đóng');
  const paid = list.filter((f) => f.status === 'Đã đóng');
  const total = due.reduce((s, f) => s + f.amount, 0);
  const row = (f) => (
    <Pressable key={f.id} onPress={() => nav.navigate('Fee', { id: f.id })} accessibilityRole="button" style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.line }}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: '700', color: colors.dark }}>{f.title}</Text>
        <Text style={{ fontSize: 12, color: colors.gray }}>{f.status === 'Đã đóng' ? `Đóng ngày ${fmtDate(f.paidDate)}` : `Hạn ${fmtDate(f.due)}`}</Text>
      </View>
      <View style={{ alignItems: 'flex-end', gap: 4 }}><Text style={{ fontWeight: '700', color: colors.dark }}>{money(f.amount)}</Text><Badge label={f.status} tone={FEE_TONE[f.status]} /></View>
    </Pressable>
  );
  return (
    <Screen>
      <View style={{ backgroundColor: colors.primary, borderRadius: 18, padding: 18, gap: 4 }}>
        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>Cần đóng của {KIDS[kid].name}</Text>
        <Text style={{ color: colors.white, fontSize: 28, fontWeight: '700' }}>{money(total)}</Text>
        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>{due.length ? `${due.length} khoản${due.some((f) => f.status === 'Quá hạn') ? ', có khoản quá hạn' : ''}` : 'Đã thanh toán đủ'}</Text>
      </View>
      <Note kind="warn">Thanh toán trong app chưa được hỗ trợ. Nút Thanh toán chỉ minh họa giao diện; vui lòng đóng tại trường hoặc theo hướng dẫn của nhà trường.</Note>
      <Card title="Khoản phải đóng">{due.length ? due.map(row) : <Empty icon="checkmark-circle-outline" text="Không có khoản nào cần đóng." />}</Card>
      <Card title="Đã đóng">{paid.length ? paid.map(row) : <Empty icon="receipt-outline" text="Chưa có khoản nào." />}</Card>
    </Screen>
  );
}

export function Fee() {
  const { params } = useRoute();
  const { kid, data, isMain } = useApp();
  const toast = useToast();
  const [sheet, setSheet] = useState(null); // 'pay' | 'receipt'
  if (!isMain) return <LockedFees />;
  const f = data.fees[kid].find((x) => x.id === params.id);
  if (!f) return <Screen><Empty text="Không tìm thấy khoản này." /></Screen>;
  const info = [['Loại khoản', f.type], ['Hạn đóng', fmtDate(f.due)], ['Bé', KIDS[kid].name], ...(f.status === 'Đã đóng' ? [['Ngày đóng', fmtDate(f.paidDate)]] : [])];
  return (
    <Screen>
      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}><Text style={{ flex: 1, fontSize: 16, fontWeight: '700', color: colors.dark }}>{f.title}</Text><Badge label={f.status} tone={FEE_TONE[f.status]} /></View>
        <Text style={{ fontSize: 28, fontWeight: '700', color: colors.primary }}>{money(f.amount)}</Text>
        {info.map(([k, v]) => <View key={k} style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ color: colors.gray }}>{k}</Text><Text style={{ color: colors.dark }}>{v}</Text></View>)}
      </Card>
      {f.status === 'Đã đóng' ? <Btn label={`Xem biên lai ${f.receipt}`} kind="primary" icon="receipt" onPress={() => setSheet('receipt')} /> : <Btn label="Thanh toán" kind="primary" icon="wallet" onPress={() => setSheet('pay')} />}
      {sheet === 'pay' && (
        <Sheet title="Thanh toán (mô phỏng)" onClose={() => setSheet(null)}>
          <Note kind="warn">Chưa hỗ trợ thanh toán trong app. Giao diện chỉ để minh họa; không có khoản tiền nào được ghi nhận.</Note>
          <Text style={{ color: colors.dark }}>Số tiền: <Text style={{ fontWeight: '700' }}>{money(f.amount)}</Text></Text>
          {[['qr-code', 'Quét mã QR ngân hàng'], ['card', 'VNPay'], ['phone-portrait', 'Momo']].map(([icon, label]) => (
            <Pressable key={label} onPress={() => toast('Chưa hỗ trợ thanh toán trong app (mô phỏng)')} accessibilityRole="button" style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB' }}>
              <Ionicons name={icon} size={20} color={colors.primary} /><Text style={{ fontWeight: '700', color: colors.dark }}>{label}</Text>
            </Pressable>
          ))}
        </Sheet>
      )}
      {sheet === 'receipt' && (
        <Sheet title={`Biên lai ${f.receipt}`} onClose={() => setSheet(null)}>
          <View style={{ borderWidth: 1, borderStyle: 'dashed', borderColor: '#D1D5DB', borderRadius: 16, padding: 16, gap: 8 }}>
            <Text style={{ textAlign: 'center', fontWeight: '700', color: colors.primary }}>HỆ THỐNG GIÁO DỤC MẦM NON ÁNH DƯƠNG</Text>
            <Text style={{ textAlign: 'center', fontSize: 12, color: colors.gray }}>{KIDS[kid].campus}</Text>
            <Text style={{ textAlign: 'center', fontWeight: '700', marginVertical: 4 }}>BIÊN LAI THU TIỀN</Text>
            {[['Số', f.receipt], ['Ngày', fmtDate(f.paidDate)], ['Học sinh', `${KIDS[kid].name} (${KIDS[kid].cls})`], ['Nội dung', f.title]].map(([k, v]) => <View key={k} style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}><Text style={{ color: colors.gray }}>{k}</Text><Text style={{ flex: 1, textAlign: 'right', color: colors.dark }}>{v}</Text></View>)}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ fontWeight: '700' }}>Số tiền</Text><Text style={{ fontWeight: '700' }}>{money(f.amount)}</Text></View>
            <Text style={{ fontSize: 11, color: colors.gray }}>Biên lai nội bộ do nhà trường xuất, không phải hóa đơn VAT.</Text>
          </View>
          <Btn label="Tải PDF" kind="primary" icon="download" onPress={() => toast('Đã tải biên lai (demo)')} />
        </Sheet>
      )}
    </Screen>
  );
}

/* ===== Hồ sơ & cài đặt ===== */
const SETTINGS = ['Nhật ký và ảnh', 'Đón trả và điểm danh', 'Thuốc và sức khỏe', 'Học phí', 'Thông báo nhà trường'];
export function Profile() {
  const { user, kid, phone, isMain } = useApp();
  const toast = useToast();
  const [on, setOn] = useState(SETTINGS.map(() => true));
  const [invite, setInvite] = useState(false);
  const k = KIDS[kid];
  const rel = [['Nguyễn Thị Hoa', 'Phụ huynh chính', '0905123456'], ...(kid === 'bin' ? [['Nguyễn Văn Bà', 'Người thân (xem, đón bé)', '0912345678']] : [])];
  return (
    <Screen>
      <Card title={`Hồ sơ ${k.name}`}>
        {[['Lớp', k.cls], ['Cơ sở', k.campus], ['Ngày sinh', k.dob], ['GV chủ nhiệm', k.teacher]].map(([a, b]) => <View key={a} style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}><Text style={{ color: colors.gray }}>{a}</Text><Text style={{ flex: 1, textAlign: 'right', color: colors.dark }}>{b}</Text></View>)}
        <Text style={{ fontSize: 11, color: colors.gray }}>Thông tin do nhà trường quản lý. Cần sửa, vui lòng liên hệ nhà trường.</Text>
      </Card>
      <Card title="Người thân có quyền xem bé" action={isMain ? <Text style={{ fontSize: 12, fontWeight: '700', color: colors.primary }} onPress={() => setInvite(true)}>Mời thêm</Text> : null}>
        {rel.map(([n, r, p]) => <View key={p} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}><View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.tint2, alignItems: 'center', justifyContent: 'center' }}><Ionicons name="person" size={18} color={colors.primary} /></View><View style={{ flex: 1 }}><Text style={{ fontWeight: '700', color: colors.dark }}>{n}</Text><Text style={{ fontSize: 12, color: colors.gray }}>{r} · {p}</Text></View></View>)}
      </Card>
      <Card title="Quyền riêng tư">
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}><Text style={{ color: colors.dark }}>Đồng ý chụp và hiển thị ảnh</Text><Badge label="Đã đồng ý" tone="green" /></View>
        <Text style={{ fontSize: 11, color: colors.gray }}>Do nhà trường ghi nhận khi nhập học. Muốn thay đổi, hãy liên hệ nhà trường.</Text>
      </Card>
      <Card title="Cài đặt thông báo">
        {SETTINGS.map((label, i) => (
          <View key={label} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 44 }}>
            <Text style={{ color: colors.dark }}>{label}</Text>
            <Switch value={on[i]} disabled={i === 3 && !isMain} trackColor={{ true: colors.primary }} onValueChange={(v) => { setOn(on.map((x, j) => (j === i ? v : x))); toast(v ? 'Đã bật' : 'Đã tắt'); }} accessibilityLabel={label} />
          </View>
        ))}
      </Card>
      <Card title="Tài khoản">
        <Text style={{ color: colors.dark }}>{user.name} · {phone}</Text>
        <Btn label="Đăng xuất mọi thiết bị" icon="laptop-outline" onPress={() => toast('Đã đăng xuất các thiết bị khác')} />
      </Card>
      {invite && <InviteSheet onClose={() => setInvite(false)} />}
    </Screen>
  );
}

function InviteSheet({ onClose }) {
  const toast = useToast();
  const [phone, setPhone] = useState('');
  const [rel, setRel] = useState('Bà');
  const [error, setError] = useState('');
  const send = () => {
    if (!/^(0|\+84)\d{9,10}$/.test(phone.replace(/[\s.-]/g, ''))) { setError('Số điện thoại chưa đúng.'); return; }
    onClose(); toast('Đã gửi lời mời, chờ nhà trường xác nhận');
  };
  return (
    <Sheet title="Mời người thân" onClose={onClose}>
      <Text style={{ fontSize: 12, color: colors.gray, lineHeight: 18 }}>Người thân có quyền &quot;Xem&quot;: nhật ký, thực đơn, thông báo, đón bé và nhắn cô. Không xem học phí. Nhà trường sẽ xác nhận số điện thoại.</Text>
      <Field label="Số điện thoại" value={phone} onChangeText={setPhone} keyboardType="phone-pad" error={error} />
      <Chips items={['Bố', 'Mẹ', 'Ông', 'Bà', 'Khác'].map((x) => [x, x])} value={rel} onChange={setRel} />
      <Btn label="Gửi lời mời" kind="primary" onPress={send} />
    </Sheet>
  );
}
