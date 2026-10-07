import { useState } from 'react';
import { Image, KeyboardAvoidingView, Linking, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HOTLINE, isPhone, USERS } from '../data';
import { useApp } from '../store';
import { colors } from '../theme';
import { Btn, Field, Note, useToast } from '../ui';

const OTP_MAX_TRIES = 5;
const RESEND_MS = 30000;

export default function Auth() {
  const { login } = useApp();
  const toast = useToast();
  const [step, setStep] = useState('phone'); // phone | otp | unknown
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [sentAt, setSentAt] = useState(0);
  const [tries, setTries] = useState(0);

  const submitPhone = () => {
    const v = phone.replace(/[\s.-]/g, '');
    if (!isPhone(v)) { setError('Số điện thoại chưa đúng (ví dụ 0905 123 456).'); return; }
    setError('');
    if (!USERS[v]) { setStep('unknown'); return; }
    setPhone(v); setSentAt(Date.now()); setTries(0); setOtp(''); setStep('otp');
  };
  const submitOtp = () => {
    if (tries >= OTP_MAX_TRIES) { setError('Nhập sai quá 5 lần. Vui lòng thử lại sau.'); return; }
    if (!/^\d{6}$/.test(otp)) { setTries(tries + 1); setError('Mã gồm 6 chữ số.'); return; }
    login(phone);
  };
  const resend = () => {
    if (Date.now() - sentAt < RESEND_MS) { toast('Vui lòng chờ 30 giây trước khi gửi lại mã'); return; }
    setSentAt(Date.now()); toast('Đã gửi lại mã xác thực');
  };

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.body} keyboardShouldPersistTaps="handled">
          <Image source={require('../../assets/logo.png')} style={s.logo} resizeMode="contain" accessibilityLabel="Ánh Dương Education System" />
          {step === 'phone' && (
            <View style={s.form}>
              <Text style={s.h1}>Đăng nhập Phụ huynh</Text>
              <Text style={s.sub}>Nhập số điện thoại đã đăng ký với nhà trường. Chúng tôi gửi mã xác thực qua Zalo/SMS.</Text>
              <Field label="Số điện thoại" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="0905 xxx xxx" error={error} />
              <Btn label="Nhận mã" kind="primary" onPress={submitPhone} />
              <View style={s.demo}>
                <Text style={s.demoTitle}>Số dùng thử</Text>
                <Text style={s.demoLine} onPress={() => setPhone('0905123456')}>0905123456 · Phụ huynh chính, 2 bé (Việt Trì, Nha Trang)</Text>
                <Text style={s.demoLine} onPress={() => setPhone('0912345678')}>0912345678 · Người thân (ông của bé Bin)</Text>
                <Text style={s.demoLine}>Số khác → &quot;chưa được đăng ký&quot;.</Text>
              </View>
            </View>
          )}
          {step === 'otp' && (
            <View style={s.form}>
              <Text style={s.h1}>Nhập mã xác thực</Text>
              <Text style={s.sub}>Mã 6 số đã gửi tới {phone} qua Zalo/SMS. Mã có hiệu lực 5 phút.</Text>
              <Field label="Mã OTP" value={otp} onChangeText={setOtp} keyboardType="number-pad" maxLength={6} placeholder="______" error={error} />
              <Btn label="Xác nhận" kind="primary" onPress={submitOtp} />
              <Btn label="Gửi lại mã" onPress={resend} />
              <Btn label="Đổi số điện thoại" onPress={() => { setStep('phone'); setError(''); }} />
              <Note>Demo: nhập 6 số bất kỳ.</Note>
            </View>
          )}
          {step === 'unknown' && (
            <View style={[s.form, { alignItems: 'center' }]}>
              <Text style={s.h1}>Số điện thoại chưa được đăng ký</Text>
              <Text style={s.sub}>Tài khoản do nhà trường tạo khi nhập học. Vui lòng liên hệ nhà trường để được cấp quyền.</Text>
              <Btn label={`Gọi ${HOTLINE}`} kind="green" icon="call" onPress={() => Linking.openURL('tel:0965284866')} />
              <Btn label="Thử số khác" onPress={() => { setStep('phone'); setError(''); }} />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  body: { flexGrow: 1, justifyContent: 'center', padding: 24, gap: 20, maxWidth: 520, width: '100%', alignSelf: 'center' },
  logo: { width: '100%', height: 56 },
  form: { gap: 14 },
  h1: { fontSize: 22, fontWeight: '700', color: colors.dark, textAlign: 'center' },
  sub: { fontSize: 13, color: colors.gray, textAlign: 'center', lineHeight: 19 },
  demo: { backgroundColor: colors.tint, borderRadius: 12, padding: 12, gap: 4 },
  demoTitle: { fontSize: 12, fontWeight: '700', color: colors.dark },
  demoLine: { fontSize: 12, color: colors.dark, textDecorationLine: 'underline' },
});
