'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { SocialSignIn, type SocialSignInProvider } from '../components/social-sign-in/SocialSignIn';

const PROVIDERS: SocialSignInProvider[] = [
  { key: 'google', label: 'Google', brand: 'google' }, { key: 'github', label: 'GitHub', brand: 'github' },
  { key: 'figma', label: 'Figma', brand: 'figma' }, { key: 'sso', label: 'SSO', icon: 'lock' }
];

/* ---------- Social sign-in: Figma was used last; any provider signs Maya in after a second ---------- */
export default function SocialSignInDemo() {
  return (
    <div style={{ width: '100%' }}>
      <SocialSignIn providers={PROVIDERS} defaultLastUsed="figma" user={{ name: 'Maya', initials: 'MK', color: 'var(--dm-pl)' }}
        onSignIn={() => new Promise(res => setTimeout(res, 1100))} />
    </div>
  );
}
