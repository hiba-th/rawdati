import { Tabs } from 'expo-router/js-tabs';
import { TabBar, TabItem } from '../../components/TabBar';
import { colors } from '../../theme/tokens';

const ITEMS: TabItem[] = [
  { name: 'checkin', label: 'Check-in', icon: 'checkCircle' },
  { name: 'log', label: 'Log day', icon: 'clipboard' },
  { name: 'post', label: 'Post', icon: 'camera' },
  { name: 'parents', label: 'Parents', icon: 'chat' },
];

// Teacher tabs: Check-in · Log day · Post · Parents
export default function TeacherTabs() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} items={ITEMS} teacher />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.groundTeacher } }}
    >
      <Tabs.Screen name="checkin" />
      <Tabs.Screen name="log" />
      <Tabs.Screen name="post" />
      <Tabs.Screen name="parents" />
    </Tabs>
  );
}
