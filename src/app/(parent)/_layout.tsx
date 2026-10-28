import { Tabs } from 'expo-router/js-tabs';
import { TabBar, TabItem } from '../../components/TabBar';
import { colors } from '../../theme/tokens';

const ITEMS: TabItem[] = [
  { name: 'home', label: 'Home', icon: 'home' },
  { name: 'day', label: 'My day', icon: 'sun' },
  { name: 'photos', label: 'Photos', icon: 'image' },
  { name: 'fees', label: 'Fees', icon: 'card' },
  { name: 'me', label: 'Me', icon: 'user' },
];

// Parent bottom tabs: Home · My day · Photos · Fees · Me
export default function ParentTabs() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} items={ITEMS} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.ground } }}
    >
      {ITEMS.map((i) => (
        <Tabs.Screen key={i.name} name={i.name} />
      ))}
    </Tabs>
  );
}
