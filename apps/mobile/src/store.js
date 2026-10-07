import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { initialData, USERS } from './data';

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

export function AppProvider({ children }) {
  const [phone, setPhone] = useState(null); // số điện thoại đã đăng nhập
  const [kid, setKid] = useState('bin');
  const [data, setData] = useState(initialData);

  const user = phone ? USERS[phone] : null;
  const isMain = user?.role === 'main';

  /** Cập nhật một nhánh dữ liệu: update('leaves', (list) => [...]) */
  const update = useCallback((key, fn) => setData((d) => ({ ...d, [key]: fn(d[key]) })), []);

  const value = useMemo(() => ({
    phone, user, isMain, kid, setKid, data, update,
    login: (p) => { setPhone(p); setKid(USERS[p].kids[0]); },
    logout: () => setPhone(null),
    unread: data.notices.filter((n) => !n.read).length,
  }), [phone, user, isMain, kid, data, update]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
