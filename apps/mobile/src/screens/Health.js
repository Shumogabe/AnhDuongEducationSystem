import { useState } from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle, G, Polyline, Text as SvgText } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { fmtDate, GROWTH, KIDS, VACCINES } from '../data';
import { useApp } from '../store';
import { colors } from '../theme';
import { Badge, Btn, Card, Empty, Field, Note, Row, Screen, Select, Sheet, useToast } from '../ui';

export function Health() {
  const { kid, data, update } = useApp();
  const nav = useNavigation();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const g = GROWTH[kid][GROWTH[kid].length - 1];
  const allergies = data.allergies[kid];
  const medsOpen = data.meds.filter((m) => m.kid === kid && m.status !== 'Đã cho uống').length;
  const save = () => {
    if (!text.trim()) { setError('Vui lòng nhập thông tin.'); return; }
    update('allergies', (a) => ({ ...a, [kid]: [...a[kid], text.trim()] }));
    setOpen(false); setText(''); setError(''); toast('Đã gửi, nhà bếp và cô sẽ nhận được');
  };
  return (
    <Screen>
      <Row icon="medkit" iconTone="green" title="Dặn thuốc" sub={`${medsOpen} đơn đang xử lý`} onPress={() => nav.navigate('Meds')} />
      <Row icon="trending-up" iconTone="blue" title="Biểu đồ tăng trưởng" sub={`${g[1]} kg · ${g[2]} cm (tháng ${g[0].slice(1)})`} onPress={() => nav.navigate('Growth')} />
      <Card title="Tiêm chủng">
        {VACCINES[kid].map((v) => (
          <View key={v[0]} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8, paddingVertical: 4 }}>
            <Text style={{ flex: 1, color: colors.dark }}>{v[0]}</Text>
            <Badge label={v[2] ? `Đã tiêm ${fmtDate(v[1])}` : `Dự kiến ${fmtDate(v[1])}`} tone={v[2] ? 'green' : 'yellow'} />
          </View>
        ))}
      </Card>
      <Card title="Dị ứng" action={<Text style={{ fontSize: 12, fontWeight: '700', color: colors.primary }} onPress={() => setOpen(true)}>Khai báo thêm</Text>}>
        {allergies.length ? allergies.map((a) => <Text key={a} style={{ color: colors.dark }}>⚠ {a}</Text>) : <Text style={{ color: colors.gray }}>Chưa khai báo dị ứng.</Text>}
        <Text style={{ fontSize: 11, color: colors.gray }}>Thông tin này được gửi tới nhà bếp và cô chủ nhiệm.</Text>
      </Card>
      {open && (
        <Sheet title="Khai báo dị ứng" onClose={() => setOpen(false)}>
          <Field label="Tác nhân và biểu hiện" value={text} onChangeText={setText} placeholder="Ví dụ: Sữa bò (nổi mẩn, tiêu chảy)" error={error} />
          <Btn label="Gửi cho nhà trường" kind="primary" onPress={save} />
        </Sheet>
      )}
    </Screen>
  );
}

const MED_TONE = { 'Đã gửi': 'blue', 'Cô đã nhận': 'yellow', 'Đã cho uống': 'green', 'Cần liên hệ': 'red' };
export function Meds() {
  const { kid, data, update, isMain } = useApp();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ drug: '', dose: '', time: '', days: 'Hôm nay' });
  const [errors, setErrors] = useState({});
  const list = data.meds.filter((m) => m.kid === kid);
  const save = () => {
    const errs = {};
    if (!f.drug.trim()) errs.drug = 'Vui lòng nhập tên thuốc.';
    if (!f.dose.trim()) errs.dose = 'Vui lòng nhập liều dùng.';
    if (!/^\d{1,2}[:h]\d{2}/.test(f.time.trim())) errs.time = 'Nhập giờ dạng 11:30.';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    update('meds', (m) => [{ id: Date.now(), kid, drug: f.drug.trim(), dose: f.dose.trim(), time: f.time.trim(), days: f.days, status: 'Đã gửi', note: '' }, ...m]);
    setOpen(false); setF({ drug: '', dose: '', time: '', days: 'Hôm nay' }); toast('Đã gửi đơn dặn thuốc cho cô');
  };
  return (
    <Screen>
      {isMain ? <Btn label="Gửi đơn dặn thuốc" kind="primary" icon="add" onPress={() => setOpen(true)} /> : <Note kind="lock">Chỉ Phụ huynh chính được gửi đơn dặn thuốc. Bạn có thể xem trạng thái.</Note>}
      <Card title={`Đơn của ${KIDS[kid].name}`}>
        {list.length === 0 ? <Empty icon="medkit-outline" text="Chưa có đơn thuốc." /> : list.map((m) => (
          <View key={m.id} style={{ paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.line, gap: 4 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}><Text style={{ flex: 1, fontWeight: '700', color: colors.dark }}>{m.drug}</Text><Badge label={m.status} tone={MED_TONE[m.status]} /></View>
            <Text style={{ fontSize: 12, color: colors.gray }}>{m.dose} · {m.time} · {m.days}</Text>
            {m.note ? <Text style={{ fontSize: 12, color: colors.green }}>✓ {m.note}</Text> : null}
          </View>
        ))}
      </Card>
      {open && (
        <Sheet title="Đơn dặn thuốc" onClose={() => setOpen(false)}>
          <Field label="Tên thuốc" value={f.drug} onChangeText={(v) => setF({ ...f, drug: v })} error={errors.drug} />
          <Field label="Liều dùng" value={f.dose} onChangeText={(v) => setF({ ...f, dose: v })} placeholder="5ml, 1 gói..." error={errors.dose} />
          <Field label="Giờ uống" value={f.time} onChangeText={(v) => setF({ ...f, time: v })} placeholder="11:30" error={errors.time} />
          <Select label="Thời gian dùng" value={f.days} options={['Hôm nay', '2 ngày', '3 ngày', '5 ngày', '7 ngày'].map((x) => [x, x])} onChange={(v) => setF({ ...f, days: v })} />
          <Btn label="Đính kèm ảnh đơn thuốc / toa bác sĩ" icon="camera" onPress={() => toast('Chọn ảnh đơn thuốc (demo)')} />
          <Text style={{ fontSize: 12, color: colors.gray }}>Cô sẽ xác nhận đã nhận thuốc và ghi lại giờ cho bé uống.</Text>
          <Btn label="Gửi đơn" kind="primary" onPress={save} />
        </Sheet>
      )}
    </Screen>
  );
}

const W = 320;
const H = 150;
const P = 24;
function LineChart({ data, idx, color }) {
  const vals = data.map((d) => d[idx]);
  const pad = idx === 1 ? 0.3 : 0.9;
  const min = Math.min(...vals) - pad;
  const max = Math.max(...vals) + pad;
  const pts = vals.map((v, i) => [P + (i * (W - 2 * P)) / (vals.length - 1), H - P - ((v - min) / (max - min)) * (H - 2 * P)]);
  return (
    <Svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} accessibilityLabel="Biểu đồ tăng trưởng">
      <Polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke={color} strokeWidth={2.5} />
      {pts.map((p, i) => (
        <G key={i}>
          <Circle cx={p[0]} cy={p[1]} r={3.5} fill={color} />
          <SvgText x={p[0]} y={p[1] - 8} fontSize={10} textAnchor="middle" fill="#4b5563">{vals[i]}</SvgText>
          <SvgText x={p[0]} y={H - 6} fontSize={10} textAnchor="middle" fill="#9ca3af">{data[i][0]}</SvgText>
        </G>
      ))}
    </Svg>
  );
}

export function Growth() {
  const { kid } = useApp();
  const data = GROWTH[kid];
  return (
    <Screen>
      <Card title="Cân nặng (kg)"><LineChart data={data} idx={1} color={colors.primary} /></Card>
      <Card title="Chiều cao (cm)"><LineChart data={data} idx={2} color={colors.green} /></Card>
      <Text style={{ fontSize: 12, color: colors.gray, lineHeight: 18 }}>Chỉ số do y tế nhà trường đo theo kỳ. Đánh giá theo chuẩn WHO do cô y tế thực hiện. Nếu có băn khoăn, hãy nhắn cô chủ nhiệm.</Text>
    </Screen>
  );
}
