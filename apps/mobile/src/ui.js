import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, tones } from './theme';

/* ===== Toast ===== */
const ToastContext = createContext(() => {});
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timer = useRef();
  const show = useCallback((message, kind) => {
    setToast({ message, kind });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 3000);
  }, []);
  return (
    <ToastContext.Provider value={show}>
      {children}
      {toast && (
        <View pointerEvents="none" style={s.toastWrap}>
          <View style={[s.toast, toast.kind === 'error' && { backgroundColor: colors.red }]}>
            <Text style={s.toastText} accessibilityRole="alert">{toast.message}</Text>
          </View>
        </View>
      )}
    </ToastContext.Provider>
  );
}

/* ===== Cơ bản ===== */
export function Card({ title, action, children, style }) {
  return (
    <View style={[s.card, style]}>
      {(title || action) && (
        <View style={s.cardHead}>
          <Text style={s.cardTitle}>{title}</Text>
          {action}
        </View>
      )}
      {children}
    </View>
  );
}

export function Btn({ label, onPress, kind = 'ghost', icon, disabled, style, small }) {
  const palette = {
    primary: { bg: colors.primary, fg: colors.white, border: colors.primary },
    ghost: { bg: colors.white, fg: colors.primary, border: colors.tint3 },
    green: { bg: colors.green, fg: colors.white, border: colors.green },
    danger: { bg: colors.white, fg: colors.red, border: '#FECACA' },
  }[kind];
  return (
    <Pressable onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityLabel={label}
      style={({ pressed }) => [s.btn, small && { minHeight: 36, paddingHorizontal: 14 }, { backgroundColor: palette.bg, borderColor: palette.border, opacity: disabled ? 0.5 : pressed ? 0.85 : 1 }, style]}>
      {icon && <Ionicons name={icon} size={16} color={palette.fg} style={{ marginRight: 6 }} />}
      <Text style={[s.btnText, { color: palette.fg }]}>{label}</Text>
    </Pressable>
  );
}

export function Badge({ label, tone = 'gray' }) {
  const t = tones[tone];
  return <View style={[s.badge, { backgroundColor: t.bg }]}><Text style={[s.badgeText, { color: t.fg }]}>{label}</Text></View>;
}

export function Row({ icon, iconTone = 'brand', title, sub, right, onPress }) {
  const t = tones[iconTone];
  const body = (
    <View style={s.row}>
      {icon && <View style={[s.rowIcon, { backgroundColor: t.bg }]}><Ionicons name={icon} size={20} color={t.fg} /></View>}
      <View style={{ flex: 1 }}>
        <Text style={s.rowTitle}>{title}</Text>
        {sub ? <Text style={s.rowSub}>{sub}</Text> : null}
      </View>
      {right}
      {onPress && <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />}
    </View>
  );
  return onPress ? <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [s.rowCard, pressed && { opacity: 0.85 }]}>{body}</Pressable> : <View style={s.rowCard}>{body}</View>;
}

export function Note({ kind = 'info', children }) {
  const lock = kind === 'lock' || kind === 'warn';
  return (
    <View style={[s.note, lock ? { backgroundColor: '#FEFCE8', borderColor: '#FDE68A' } : { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}>
      <Ionicons name={kind === 'lock' ? 'lock-closed' : kind === 'warn' ? 'warning' : 'information-circle'} size={16} color={lock ? '#854D0E' : '#1E40AF'} style={{ marginTop: 1 }} />
      <Text style={[s.noteText, { color: lock ? '#854D0E' : '#1E40AF' }]}>{children}</Text>
    </View>
  );
}

export function Empty({ icon = 'folder-open-outline', text }) {
  return <View style={{ alignItems: 'center', paddingVertical: 28 }}><Ionicons name={icon} size={32} color="#9CA3AF" /><Text style={{ color: '#9CA3AF', marginTop: 8, textAlign: 'center' }}>{text}</Text></View>;
}

export function Chips({ items, value, onChange }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 2 }}>
      {items.map(([k, label]) => (
        <Pressable key={k} onPress={() => onChange(k)} accessibilityRole="tab" accessibilityState={{ selected: k === value }} style={[s.chip, k === value && s.chipOn]}>
          <Text style={[s.chipText, k === value && { color: colors.white }]}>{label}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

export function Field({ label, error, hint, style, ...rest }) {
  return (
    <View style={style}>
      {label ? <Text style={s.label}>{label}</Text> : null}
      <TextInput placeholderTextColor="#9CA3AF" accessibilityLabel={label} {...rest} style={[s.input, error && { borderColor: colors.red }, rest.multiline && { minHeight: 80, textAlignVertical: 'top' }]} />
      {hint ? <Text style={s.hint}>{hint}</Text> : null}
      {error ? <Text style={s.error} accessibilityRole="alert">{error}</Text> : null}
    </View>
  );
}

export function Select({ label, value, options, onChange }) {
  return (
    <View>
      {label ? <Text style={s.label}>{label}</Text> : null}
      <Chips items={options} value={value} onChange={onChange} />
    </View>
  );
}

/** Bottom sheet dạng Modal. */
export function Sheet({ title, onClose, children }) {
  return (
    <Modal transparent animationType="slide" onRequestClose={onClose} visible>
      <Pressable style={s.backdrop} onPress={onClose} accessibilityLabel="Đóng" />
      <View style={s.sheet}>
        <View style={s.sheetHead}>
          <Text style={s.sheetTitle}>{title}</Text>
          <Pressable onPress={onClose} accessibilityLabel="Đóng" style={s.close}><Ionicons name="close" size={22} color={colors.dark} /></Pressable>
        </View>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 18, gap: 14 }}>{children}</ScrollView>
      </View>
    </Modal>
  );
}

export function Screen({ children, scroll = true, style }) {
  if (!scroll) return <View style={[s.screen, style]}>{children}</View>;
  return <ScrollView style={s.screen} contentContainerStyle={[{ padding: 16, paddingBottom: 40, gap: 14 }, style]} keyboardShouldPersistTaps="handled">{children}</ScrollView>;
}

export function useTick(ms, fn, active = true) {
  const saved = useRef(fn);
  useEffect(() => { saved.current = fn; }, [fn]);
  useEffect(() => {
    if (!active) return undefined;
    const id = setInterval(() => saved.current(), ms);
    return () => clearInterval(id);
  }, [ms, active]);
}

export const useFormErrors = () => {
  const [errors, setErrors] = useState({});
  return [errors, setErrors];
};

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  card: { backgroundColor: colors.white, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, padding: 14, gap: 10 },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: colors.primary, flexShrink: 1 },
  btn: { minHeight: 44, paddingHorizontal: 18, borderRadius: radius.pill, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  btnText: { fontSize: 13, fontWeight: '700' },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  rowCard: { backgroundColor: colors.white, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, padding: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  rowTitle: { fontSize: 14, fontWeight: '700', color: colors.dark },
  rowSub: { fontSize: 12, color: colors.gray, marginTop: 2 },
  note: { flexDirection: 'row', gap: 10, padding: 12, borderRadius: 12, borderWidth: 1 },
  noteText: { flex: 1, fontSize: 12, lineHeight: 17 },
  chip: { minHeight: 40, paddingHorizontal: 16, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.tint3, backgroundColor: colors.white, justifyContent: 'center' },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 12, fontWeight: '600', color: colors.dark },
  label: { fontSize: 12, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: { minHeight: 46, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 14, backgroundColor: colors.white, paddingHorizontal: 14, fontSize: 16, color: colors.dark },
  hint: { fontSize: 11, color: colors.gray, marginTop: 4 },
  error: { fontSize: 12, color: colors.red, marginTop: 4 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: { maxHeight: '88%', backgroundColor: colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, width: '100%', maxWidth: 520, alignSelf: 'center' },
  sheetHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.line },
  sheetTitle: { fontSize: 16, fontWeight: '700', color: colors.dark },
  close: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  toastWrap: { position: 'absolute', left: 0, right: 0, bottom: 96, alignItems: 'center', paddingHorizontal: 20 },
  toast: { backgroundColor: colors.deep, borderRadius: radius.pill, paddingHorizontal: 18, paddingVertical: 11, maxWidth: 420 },
  toastText: { color: colors.white, fontSize: 12, fontWeight: '600', textAlign: 'center' },
});
