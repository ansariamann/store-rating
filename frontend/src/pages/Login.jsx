import AuthForm from '../components/AuthForm';

export default function Login() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '2rem' }}>
      <AuthForm type="login" />
    </div>
  );
}
