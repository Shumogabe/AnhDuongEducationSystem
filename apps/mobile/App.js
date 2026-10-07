import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Auth from './src/screens/Auth';
import { Growth, Health, Meds } from './src/screens/Health';
import { Fee, Fees, Menu, Notice, Notices, Profile } from './src/screens/Misc';
import { Codes, Leave, People, Pickup } from './src/screens/Pickup';
import { Chat, Diary, Home, KidHeader, More } from './src/screens/Tabs';
import { AppProvider, useApp } from './src/store';
import { colors } from './src/theme';
import { ToastProvider } from './src/ui';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TAB_ICONS = {
  'Hôm nay': ['home', 'home-outline'],
  'Nhật ký': ['book', 'book-outline'],
  'Đón trả': ['qr-code', 'qr-code-outline'],
  'Tin nhắn': ['chatbubbles', 'chatbubbles-outline'],
  Thêm: ['ellipsis-horizontal-circle', 'ellipsis-horizontal-circle-outline'],
};

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: () => <KidHeader />,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#6B7280',
        tabBarLabelStyle: { fontSize: 11 },
        tabBarStyle: { height: 66, paddingBottom: 8, paddingTop: 4 },
        tabBarIcon: ({ focused, color, size }) => <Ionicons name={TAB_ICONS[route.name][focused ? 0 : 1]} size={size} color={color} />,
      })}
    >
      <Tab.Screen name="Hôm nay" component={Home} />
      <Tab.Screen name="Nhật ký" component={Diary} />
      <Tab.Screen name="Đón trả" component={Pickup} />
      <Tab.Screen name="Tin nhắn" component={Chat} />
      <Tab.Screen name="Thêm" component={More} />
    </Tab.Navigator>
  );
}

const headerOptions = { headerStyle: { backgroundColor: colors.primary }, headerTintColor: colors.white, headerTitleStyle: { fontWeight: '700' }, headerBackTitle: 'Quay lại' };

function Root() {
  const { user } = useApp();
  if (!user) return <Auth />;
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
      <Stack.Screen name="People" component={People} options={{ title: 'Người được phép đón' }} />
      <Stack.Screen name="Codes" component={Codes} options={{ title: 'Người đón hộ' }} />
      <Stack.Screen name="Leave" component={Leave} options={{ title: 'Xin nghỉ' }} />
      <Stack.Screen name="Health" component={Health} options={{ title: 'Sức khỏe' }} />
      <Stack.Screen name="Meds" component={Meds} options={{ title: 'Dặn thuốc' }} />
      <Stack.Screen name="Growth" component={Growth} options={{ title: 'Tăng trưởng' }} />
      <Stack.Screen name="Menu" component={Menu} options={{ title: 'Thực đơn tuần' }} />
      <Stack.Screen name="Notices" component={Notices} options={{ title: 'Thông báo' }} />
      <Stack.Screen name="Notice" component={Notice} options={{ title: 'Thông báo' }} />
      <Stack.Screen name="Fees" component={Fees} options={{ title: 'Học phí' }} />
      <Stack.Screen name="Fee" component={Fee} options={{ title: 'Chi tiết khoản' }} />
      <Stack.Screen name="Profile" component={Profile} options={{ title: 'Hồ sơ & cài đặt' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <ToastProvider>
          <NavigationContainer>
            <StatusBar style="light" />
            <Root />
          </NavigationContainer>
        </ToastProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}
