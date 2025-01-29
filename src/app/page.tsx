'use client';

import RecoveryPassword from '@/components/login/recovery-password';
import SingIn from '@/components/login/sing-in';
import SingUp from '@/components/login/sing-up';
import { useState } from 'react';

export default function Login() {
  const [typeSing, setTypeSing] = useState(0);
  return (
    <div>
      {typeSing === 0 && <SingIn setTypeSing={setTypeSing} />}
      {typeSing === 1 && <SingUp setTypeSing={setTypeSing} />}
      {typeSing === 2 && <RecoveryPassword setTypeSing={setTypeSing} />}
    </div>
  );
}
