import { Redirect } from 'expo-router';
import { useSelector } from 'react-redux';

export default function Index() {
  const { user } = useSelector((state) => state.auth);
  return <Redirect href={user ? '/(app)/home' : '/(auth)/login'} />;
}
