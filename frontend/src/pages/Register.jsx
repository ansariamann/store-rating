import AuthForm from '../components/AuthForm';

export default function Register() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '2rem' }}>
      <AuthForm type="register" />
    </div>
  );
}
