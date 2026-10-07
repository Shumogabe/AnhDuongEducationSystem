import { useRef, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { addDays, diaryFor, DOW, dowOf, fmtDate, HOTLINE, inWorkHours, KIDS, menuFor, money, TODAY } from '../data';
import { useApp } from '../store';
import { colors, radius } from '../theme';
import { Badge, Btn, Card, Empty, Row, Screen, Sheet, useToast } from '../ui';

/* ===== Header có chọn bé và chuông ===== */
export function KidHeader() {
  const { user, kid, setKid, unread } = useApp();
  const nav = useNavigation();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const k = KIDS[kid];
  const multi = user.kids.length > 1;
  return (
    <View style={[h.bar, { paddingTop: insets.top + 8 }]}>
      <Pressable onPress={() => multi && setOpen(true)} accessibilityRole="button" accessibilityLabel="Chọn bé" style={h.kid}>
        <View style={h.avatar}><Text style={h.avatarText}>{k.name.replace('Bé ', '')[0]}</Text></View>
        <View style={{ flexShrink: 1 }}>
          <Text style={h.name} numberOfLines={1}>{k.name}</Text>
          <Text style={h.sub} numberOfLines={1}>{k.cls} · {k.campus}</Text>
        </View>
        {multi && <Ionicons name="chevron-down" size={14} color={colors.white} />}
      </Pressable>
      <Pressable onPress={() => nav.navigate('Notices')} accessibilityRole="button" accessibilityLabel="Thông báo" style={h.bell}>
        <Ionicons name="notifications-outline" size={24} color={colors.white} />
        {unread > 0 && <View style={h.badge}><Text style={h.badgeText}>{unread}</Text></View>}
      </Pressable>
      {open && (
        <Sheet title="Chọn bé" onClose={() => setOpen(false)}>
          {user.kids.map((id) => (
            <Pressable key={id} onPress={() => { setKid(id); setOpen(false); }} accessibilityRole="button" style={[h.pick, id === kid && { borderColor: colors.primary, backgroundColor: colors.tint }]}>
              <View style={[h.avatar, { width: 44, height: 44, borderRadius: 22 }]}><Text style={h.avatarText}>{KIDS[id].name.replace('Bé ', '')[0]}</Text></View>
              <View>
                <Text style={{ fontWeight: '700', color: colors.dark }}>{KIDS[id].name}</Text>
                <Text style={{ fontSize: 12, color: colors.gray }}>{KIDS[id].cls} · {KIDS[id].campus}</Text>
              </View>
            </Pressable>
          ))}
        </Sheet>
      )}
    </View>
  );
}

/* ===== Hôm nay ===== */
function Shortcut({ icon, label, tone, onPress }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} style={t.short}>
      <View style={[t.shortIcon, { backgroundColor: tone[0] }]}><Ionicons name={icon} size={20} color={tone[1]} /></View>
      <Text style={t.shortText}>{label}</Text>
    </Pressable>
  );
}

export function Home() {
  const { user, kid, isMain, data } = useApp();
  const nav = useNavigation();
  const k = KIDS[kid];
  const d = diaryFor(kid, TODAY);
  const dueFees = data.fees[kid].filter((f) => f.status !== 'Đã đóng');
  const total = dueFees.reduce((s, f) => s + f.amount, 0);
  const unread = data.notices.filter((n) => !n.read);
  const dow = dowOf(TODAY);
  const meals = menuFor(kid, dow >= 1 && dow <= 5 ? dow - 1 : 0);
  return (
    <Screen>
      <View>
        <Text style={{ fontSize: 12, color: colors.gray }}>{DOW[dowOf(TODAY)]}, {fmtDate(TODAY)}</Text>
        <Text style={{ fontSize: 20, fontWeight: '700', color: colors.dark }}>Xin chào, {user.name}</Text>
      </View>
      <Card title={`Hôm nay của ${k.name}`} action={<Text style={t.link} onPress={() => nav.navigate('Nhật ký')}>Xem nhật ký</Text>}>
        <View style={t.trio}>
          <View style={[t.tile, { backgroundColor: '#F0FDF4' }]}><Ionicons name="checkmark-circle" size={22} color={colors.green} /><Text style={t.tileB}>Đã đến</Text><Text style={t.tileS}>07:42</Text></View>
          <View style={t.tile}><Ionicons name="restaurant" size={22} color={colors.gold} /><Text style={t.tileB}>{d ? d.meals[1][1].replace('Ăn ', '') : '-'}</Text><Text style={t.tileS}>Bữa trưa</Text></View>
          <View style={t.tile}><Ionicons name="moon" size={22} color={colors.blue} /><Text style={t.tileB}>{d ? d.sleep[0] : '-'}</Text><Text style={t.tileS}>Ngủ trưa</Text></View>
        </View>
      </Card>
      <View style={t.shorts}>
        <Shortcut icon="qr-code" label="Mã QR đón" tone={[colors.tint2, colors.primary]} onPress={() => nav.navigate('Đón trả')} />
        <Shortcut icon="calendar-clear" label="Xin nghỉ" tone={['#FEF3C7', colors.gold]} onPress={() => nav.navigate('Leave')} />
        <Shortcut icon="medkit" label="Dặn thuốc" tone={['#DCFCE7', colors.green]} onPress={() => nav.navigate('Meds')} />
        <Shortcut icon="chatbubbles" label="Nhắn cô" tone={['#DBEAFE', colors.blue]} onPress={() => nav.navigate('Tin nhắn')} />
      </View>
      {unread.length > 0 && (
        <Card title="Thông báo mới" action={<Text style={t.link} onPress={() => nav.navigate('Notices')}>Tất cả</Text>}>
          {unread.slice(0, 2).map((n) => (
            <Pressable key={n.id} onPress={() => nav.navigate('Notice', { id: n.id })} accessibilityRole="button" style={{ flexDirection: 'row', gap: 10 }}>
              <View style={t.dot} />
              <View style={{ flex: 1 }}><Text style={{ fontWeight: '700', color: colors.dark }}>{n.title}</Text><Text style={{ fontSize: 12, color: colors.gray }}>{n.scope} · {fmtDate(n.date)}</Text></View>
            </Pressable>
          ))}
        </Card>
      )}
      <Card title="Thực đơn hôm nay" action={<Text style={t.link} onPress={() => nav.navigate('Menu')}>Cả tuần</Text>}>
        {meals.map((m, i) => <View key={i} style={{ flexDirection: 'row', gap: 12 }}><Text style={{ width: 52, fontSize: 12, color: colors.gray }}>{['Sáng', 'Trưa', 'Chiều'][i]}</Text><Text style={{ flex: 1, color: colors.dark }}>{m}</Text></View>)}
      </Card>
      {isMain && dueFees.length > 0 && (
        <Row icon="wallet" iconTone="yellow" title="Học phí cần đóng" sub={money(total)} onPress={() => nav.navigate('Fees')} />
      )}
    </Screen>
  );
}

/* ===== Nhật ký ===== */
export function Diary() {
  const { kid } = useApp();
  const toast = useToast();
  const [date, setDate] = useState(TODAY);
  const [photo, setPhoto] = useState(0);
  const k = KIDS[kid];
  const days = Array.from({ length: 10 }, (_, i) => addDays(TODAY, -i)).reverse();
  const d = diaryFor(kid, date);
  return (
    <Screen>
      <Text style={{ fontSize: 16, fontWeight: '700', color: colors.dark }}>Nhật ký của {k.name}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {days.map((iso) => {
          const has = diaryFor(kid, iso);
          const on = iso === date;
          return (
            <Pressable key={iso} onPress={() => setDate(iso)} accessibilityRole="tab" accessibilityState={{ selected: on }} style={[t.day, on && { backgroundColor: colors.primary, borderColor: colors.primary }, !has && { opacity: 0.5 }]}>
              <Text style={[t.dayS, on && { color: colors.white }]}>{DOW[dowOf(iso)].replace('Chủ nhật', 'CN').replace('Thứ ', 'T')}</Text>
              <Text style={[t.dayN, on && { color: colors.white }]}>{iso.slice(8, 10)}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
      {!d ? <Card><Empty icon="calendar-outline" text="Không có nhật ký ngày này (ngày nghỉ hoặc chưa tới)." /></Card> : (
        <>
          <Card title="Ăn uống">{d.meals.map(([n, v]) => <View key={n} style={t.line}><Text style={{ color: colors.gray }}>{n}</Text><Text style={{ fontWeight: '700', color: colors.dark }}>{v}</Text></View>)}</Card>
          <Card title="Ngủ, vệ sinh, tâm trạng">
            <View style={t.duo}><View style={t.cell}><Text style={t.cellS}>Ngủ trưa</Text><Text style={t.cellB}>{d.sleep[0]} - {d.sleep[1]}</Text></View><View style={t.cell}><Text style={t.cellS}>Vệ sinh</Text><Text style={t.cellB}>{d.wc}</Text></View></View>
            <View style={t.cell}><Text style={t.cellS}>Tâm trạng</Text><Text style={t.cellB}>{d.mood}</Text></View>
          </Card>
          <Card title="Nhận xét của cô"><Text style={{ color: colors.dark, lineHeight: 20 }}>{d.remark}</Text><Text style={{ fontSize: 12, color: colors.gray }}>{k.teacher}</Text></Card>
          <Card title={`Ảnh hoạt động (${d.photos})`}>
            <View style={t.photos}>{Array.from({ length: d.photos }, (_, i) => <Pressable key={i} onPress={() => setPhoto(i + 1)} accessibilityRole="button" accessibilityLabel={`Xem ảnh ${i + 1}`} style={t.photo}><Ionicons name="image-outline" size={24} color={colors.primary} /></Pressable>)}</View>
            <Text style={{ fontSize: 11, color: colors.gray }}>Ảnh tự xóa sau 6 tháng. Hãy tải về những ảnh bạn muốn giữ.</Text>
          </Card>
        </>
      )}
      {photo > 0 && (
        <Sheet title={`Ảnh hoạt động ${photo}`} onClose={() => setPhoto(0)}>
          <View style={t.bigPhoto}><Ionicons name="image-outline" size={48} color={colors.primary} /><Text style={{ color: colors.primary, fontSize: 12 }}>Ảnh thật do cô giáo đăng</Text></View>
          <Btn label="Tải về" kind="primary" icon="download" onPress={() => { toast('Đã tải ảnh (demo)'); setPhoto(0); }} />
        </Sheet>
      )}
    </Screen>
  );
}

/* ===== Tin nhắn ===== */
export function Chat() {
  const { kid, data, update } = useApp();
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const listRef = useRef();
  const k = KIDS[kid];
  const ok = inWorkHours();
  const msgs = data.chats[kid];
  const now = () => { const d = new Date(); return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
  const send = () => {
    const v = text.trim();
    if (!v) return;
    const id = kid;
    update('chats', (c) => ({ ...c, [id]: [...c[id], { from: 'me', text: v, t: now() }] }));
    setText('');
    setTimeout(() => update('chats', (c) => ({ ...c, [id]: [...c[id], { from: 'teacher', text: ok ? 'Dạ cô đã nhận tin nhắn, cô sẽ phản hồi ngay ạ.' : 'Hiện đã ngoài giờ làm việc. Cô sẽ trả lời vào sáng làm việc kế tiếp ạ.', t: now() }] })), 1200);
  };
  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <ScrollView ref={listRef} onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })} contentContainerStyle={{ padding: 16, gap: 8 }}>
        <View style={t.chatHead}>
          <View style={[h.avatar, { backgroundColor: colors.tint2 }]}><Ionicons name="school" size={18} color={colors.primary} /></View>
          <View style={{ flex: 1 }}><Text style={{ fontWeight: '700', color: colors.dark }}>{k.teacher}</Text><Text style={{ fontSize: 12, color: colors.gray }}>GVCN lớp {k.cls}</Text></View>
          <Text style={{ fontSize: 12, fontWeight: '700', color: ok ? colors.green : '#9CA3AF' }}>● {ok ? 'Trong giờ làm việc' : 'Ngoài giờ'}</Text>
        </View>
        <Text style={{ fontSize: 11, color: colors.gray, textAlign: 'center' }}>Giờ làm việc 7:00 - 17:00, thứ 2 đến thứ 6. Ngoài giờ cô sẽ trả lời vào buổi sáng làm việc kế tiếp. Ban giám hiệu có thể xem nội dung trò chuyện.</Text>
        {msgs.length === 0 ? <Empty icon="chatbubbles-outline" text="Chưa có tin nhắn. Hãy chào cô nhé!" /> : msgs.map((m, i) => (
          <View key={i} style={{ alignItems: m.from === 'me' ? 'flex-end' : 'flex-start' }}>
            <View style={[t.bubble, m.from === 'me' ? t.bubbleMe : t.bubbleThem]}>
              <Text style={{ color: m.from === 'me' ? colors.white : colors.dark }}>{m.text}</Text>
              <Text style={{ fontSize: 10, marginTop: 4, color: m.from === 'me' ? 'rgba(255,255,255,0.7)' : '#9CA3AF' }}>{m.t}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={[t.composer, { paddingBottom: 10 + Math.min(insets.bottom, 8) }]}>
        <TextInput value={text} onChangeText={setText} placeholder={`Nhắn cô ${k.teacher.replace('Cô ', '')}...`} placeholderTextColor="#9CA3AF" maxLength={500} accessibilityLabel="Nội dung tin nhắn" style={t.composerInput} onSubmitEditing={send} returnKeyType="send" />
        <Pressable onPress={send} accessibilityRole="button" accessibilityLabel="Gửi" style={t.send}><Ionicons name="paper-plane" size={18} color={colors.white} /></Pressable>
      </View>
    </View>
  );
}

/* ===== Thêm ===== */
export function More() {
  const { isMain, data, logout } = useApp();
  const nav = useNavigation();
  const unread = data.notices.filter((n) => !n.read).length;
  const [contact, setContact] = useState(false);
  const { kid } = useApp();
  return (
    <Screen>
      <Text style={{ fontSize: 16, fontWeight: '700', color: colors.dark }}>Thêm</Text>
      <Row icon="heart" iconTone="green" title="Sức khỏe" onPress={() => nav.navigate('Health')} />
      <Row icon="restaurant" iconTone="yellow" title="Thực đơn tuần" onPress={() => nav.navigate('Menu')} />
      <Row icon="notifications" iconTone="blue" title="Thông báo" right={unread ? <Badge label={`${unread} mới`} tone="brand" /> : null} onPress={() => nav.navigate('Notices')} />
      <Row icon="wallet" iconTone="brand" title="Học phí" right={isMain ? null : <Ionicons name="lock-closed" size={16} color="#9CA3AF" />} onPress={() => nav.navigate('Fees')} />
      <Row icon="person" iconTone="gray" title="Hồ sơ bé và cài đặt" onPress={() => nav.navigate('Profile')} />
      <Row icon="call" iconTone="green" title="Liên hệ nhà trường" onPress={() => setContact(true)} />
      <Btn label="Đăng xuất" kind="danger" icon="log-out-outline" onPress={logout} />
      <Text style={{ textAlign: 'center', fontSize: 11, color: '#9CA3AF' }}>Ánh Dương Phụ huynh · bản demo</Text>
      {contact && (
        <Sheet title="Liên hệ nhà trường" onClose={() => setContact(false)}>
          <Text style={{ fontWeight: '700', color: colors.dark }}>{KIDS[kid].campus}</Text>
          <Btn label={`Gọi hotline ${HOTLINE}`} kind="green" icon="call" onPress={() => Linking.openURL('tel:0965284866')} />
          <Btn label="Chỉ đường" icon="navigate" onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(KIDS[kid].campus)}`)} />
        </Sheet>
      )}
    </Screen>
  );
}

const h = StyleSheet.create({
  bar: { backgroundColor: colors.primary, paddingHorizontal: 16, paddingBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  kid: { flexDirection: 'row', alignItems: 'center', gap: 10, flexShrink: 1, minHeight: 44 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.yellow, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.deep, fontWeight: '700', fontSize: 16 },
  name: { color: colors.white, fontWeight: '700', fontSize: 15 },
  sub: { color: 'rgba(255,255,255,0.8)', fontSize: 11 },
  bell: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: 4, right: 2, minWidth: 18, height: 18, borderRadius: 9, backgroundColor: colors.yellow, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  badgeText: { fontSize: 11, fontWeight: '700', color: colors.deep },
  pick: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB' },
});

const t = StyleSheet.create({
  link: { fontSize: 12, fontWeight: '700', color: colors.primary },
  trio: { flexDirection: 'row', gap: 8 },
  tile: { flex: 1, backgroundColor: colors.cream, borderRadius: 12, padding: 10, alignItems: 'center', gap: 2 },
  tileB: { fontWeight: '700', color: colors.dark, fontSize: 13 },
  tileS: { fontSize: 11, color: colors.gray },
  shorts: { flexDirection: 'row', gap: 8 },
  short: { flex: 1, backgroundColor: colors.white, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, paddingVertical: 12, alignItems: 'center', gap: 6, minHeight: 80 },
  shortIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  shortText: { fontSize: 11, fontWeight: '600', color: colors.dark, textAlign: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginTop: 6 },
  day: { minWidth: 48, minHeight: 56, borderRadius: 14, borderWidth: 1, borderColor: colors.tint3, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  dayS: { fontSize: 10, color: colors.dark },
  dayN: { fontSize: 15, fontWeight: '700', color: colors.dark },
  line: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  duo: { flexDirection: 'row', gap: 8 },
  cell: { flex: 1, backgroundColor: colors.cream, borderRadius: 12, padding: 10 },
  cellS: { fontSize: 11, color: colors.gray },
  cellB: { fontWeight: '700', color: colors.dark, marginTop: 2 },
  photos: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  photo: { width: 84, height: 84, borderRadius: 12, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.tint3, backgroundColor: colors.tint, alignItems: 'center', justifyContent: 'center' },
  bigPhoto: { height: 220, borderRadius: 16, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.tint3, backgroundColor: colors.tint, alignItems: 'center', justifyContent: 'center', gap: 6 },
  chatHead: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.white, borderRadius: 16, padding: 12, borderWidth: 1, borderColor: colors.line },
  bubble: { maxWidth: '82%', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 18 },
  bubbleMe: { backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  bubbleThem: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, borderBottomLeftRadius: 4 },
  composer: { flexDirection: 'row', gap: 8, paddingHorizontal: 12, paddingTop: 10, backgroundColor: colors.cream, borderTopWidth: 1, borderTopColor: colors.line },
  composerInput: { flex: 1, minHeight: 46, borderRadius: 23, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: colors.white, paddingHorizontal: 16, fontSize: 16, color: colors.dark },
  send: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
});
