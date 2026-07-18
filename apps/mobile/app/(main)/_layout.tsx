import {
  Ionicons,
  type IoniconsIconName,
} from "@react-native-vector-icons/ionicons";
import { Tabs, useRouter, useSegments } from "expo-router";
import {
  Drawer,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  type DrawerContentComponentProps,
} from "expo-router/drawer";
import { Platform, Pressable, type ColorValue } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useResolveClassNames } from "uniwind";

import { PrayerIcon } from "@/components/navigation/PrayerIcon";
import {
  MainTabHistoryProvider,
  useMainTabHistory,
} from "@/context/MainTabHistoryContext";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

const HEADING = "#031A17";
const ICON_SIZE = 22;

type DiaryRouteName = "index" | "review" | "prayer" | "mission";

type DiaryDrawerItem = {
  activeIcon?: IoniconsIconName;
  href:
    | "/(main)/(diary)"
    | "/(main)/(diary)/review"
    | "/(main)/(diary)/prayer"
    | "/(main)/(diary)/mission";
  inactiveIcon?: IoniconsIconName;
  label: string;
  route: DiaryRouteName;
};

const DIARY_DRAWER_ITEMS: DiaryDrawerItem[] = [
  {
    activeIcon: "book",
    href: "/(main)/(diary)",
    inactiveIcon: "book-outline",
    label: "일기",
    route: "index",
  },
  {
    activeIcon: "file-tray-full",
    href: "/(main)/(diary)/review",
    inactiveIcon: "file-tray-full-outline",
    label: "검토",
    route: "review",
  },
  {
    href: "/(main)/(diary)/prayer",
    label: "기도",
    route: "prayer",
  },
  {
    activeIcon: "earth",
    href: "/(main)/(diary)/mission",
    inactiveIcon: "earth-outline",
    label: "선교",
    route: "mission",
  },
];

type TabIconProps = {
  active: IoniconsIconName;
  color: ColorValue;
  focused: boolean;
  inactive: IoniconsIconName;
  size: number;
};

function TabIcon({ active, color, focused, inactive, size }: TabIconProps) {
  return (
    <Ionicons color={color} name={focused ? active : inactive} size={size} />
  );
}

function DiaryDrawerIcon({
  color,
  focused,
  item,
}: {
  color: ColorValue;
  focused: boolean;
  item: DiaryDrawerItem;
}) {
  if (item.route === "prayer") {
    return <PrayerIcon color={color} focused={focused} size={ICON_SIZE} />;
  }

  return (
    <Ionicons
      color={color}
      name={focused ? item.activeIcon! : item.inactiveIcon!}
      size={ICON_SIZE}
    />
  );
}

function MainDrawerContent(props: DrawerContentComponentProps) {
  const { getPreviousMainTab } = useMainTabHistory();
  const { usesCollapsibleSidebar } = useResponsiveLayout();
  const router = useRouter();
  const segments = useSegments();
  const drawerItemLabelStyle = useResolveClassNames(
    "font-brand-medium text-sm",
  );
  const drawerItemStyle = useResolveClassNames("mx-3 my-1 rounded-xl");
  const focusedMainRoute = props.state.routes[props.state.index]?.name;
  const isDiaryRoute = focusedMainRoute === "(diary)";
  const lastSegment = segments[segments.length - 1] as string | undefined;
  const focusedDiaryRoute: DiaryRouteName =
    lastSegment === "review" ||
    lastSegment === "prayer" ||
    lastSegment === "mission"
      ? lastSegment
      : "index";

  const closeCollapsibleDrawer = () => {
    if (usesCollapsibleSidebar) {
      props.navigation.closeDrawer();
    }
  };

  if (!isDiaryRoute) {
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    );
  }

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        icon={({ color }) => (
          <Ionicons color={color} name="arrow-back-outline" size={ICON_SIZE} />
        )}
        inactiveTintColor={HEADING}
        label="뒤로"
        labelStyle={drawerItemLabelStyle}
        onPress={() => {
          props.navigation.navigate(getPreviousMainTab() as never);
          closeCollapsibleDrawer();
        }}
        style={drawerItemStyle}
      />
      {DIARY_DRAWER_ITEMS.map((item) => {
        const focused = focusedDiaryRoute === item.route;

        return (
          <DrawerItem
            activeBackgroundColor="rgba(18, 133, 117, 0.12)"
            activeTintColor={HEADING}
            focused={focused}
            icon={({ color }) => (
              <DiaryDrawerIcon color={color} focused={focused} item={item} />
            )}
            inactiveTintColor={HEADING}
            key={item.route}
            label={item.label}
            labelStyle={drawerItemLabelStyle}
            onPress={() => {
              router.navigate(item.href);
              closeCollapsibleDrawer();
            }}
            style={drawerItemStyle}
          />
        );
      })}
    </DrawerContentScrollView>
  );
}

function MainTabs() {
  const insets = useSafeAreaInsets();
  const { rememberMainTab } = useMainTabHistory();
  const { isMobile } = useResponsiveLayout();
  const segments = useSegments();
  const isMobileWeb = Platform.OS === "web" && isMobile;
  const isDiaryRoute = segments.some((segment) => segment === "(diary)");
  const tabBarLabelStyle = useResolveClassNames(
    "font-brand-medium text-[11px] leading-[13px]",
  );
  const tabBarIconStyle = useResolveClassNames("mb-0.5 size-[22px]");
  const tabBarStyle = useResolveClassNames(
    "rounded-t-3xl border border-[rgba(3,26,23,0.1)] bg-white pt-2",
  );
  const tabBarItemStyle = useResolveClassNames("items-center justify-center");
  const hiddenTabBarStyle = useResolveClassNames("hidden");

  return (
    <Tabs
      backBehavior="history"
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: HEADING,
        tabBarInactiveTintColor: HEADING,
        tabBarHideOnKeyboard: true,
        tabBarButton: (props) => (
          <Pressable
            accessibilityLargeContentTitle={
              props.accessibilityLargeContentTitle
            }
            accessibilityShowsLargeContentViewer={
              props.accessibilityShowsLargeContentViewer
            }
            aria-label={props["aria-label"]}
            aria-selected={props["aria-selected"]}
            disabled={props.disabled}
            className="flex-1 self-stretch items-center justify-center p-0 active:opacity-70"
            onLongPress={props.onLongPress}
            onPress={(event) => props.onPress?.(event)}
            role={props.role}
            testID={props.testID}
          >
            {props.children}
          </Pressable>
        ),
        tabBarLabelStyle: [tabBarLabelStyle, { includeFontPadding: false }],
        tabBarLabelPosition: "below-icon",
        tabBarIconStyle,
        tabBarStyle: isDiaryRoute
          ? hiddenTabBarStyle
          : [
              tabBarStyle,
              {
                elevation: 12,
                paddingBottom: Math.max(insets.bottom, 8),
                shadowColor: HEADING,
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.04,
                shadowRadius: 10,
                ...(isMobileWeb && { height: 54 + insets.bottom }),
              },
            ],
        tabBarItemStyle,
      }}
    >
      <Tabs.Screen
        name="index"
        listeners={{
          focus: () => rememberMainTab("index"),
        }}
        options={{
          tabBarAccessibilityLabel: "홈",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              active="home"
              color={color}
              focused={focused}
              inactive="home-outline"
              size={ICON_SIZE}
            />
          ),
          title: "홈",
        }}
      />
      <Tabs.Screen
        name="(diary)"
        options={{
          tabBarAccessibilityLabel: "일기",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              active="book"
              color={color}
              focused={focused}
              inactive="book-outline"
              size={ICON_SIZE}
            />
          ),
          title: "일기",
        }}
      />
      <Tabs.Screen
        name="mokwon"
        listeners={{
          focus: () => rememberMainTab("mokwon"),
        }}
        options={{
          tabBarAccessibilityLabel: "목원",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              active="people"
              color={color}
              focused={focused}
              inactive="people-outline"
              size={ICON_SIZE}
            />
          ),
          title: "목원",
        }}
      />
      <Tabs.Screen
        name="nanum"
        listeners={{
          focus: () => rememberMainTab("nanum"),
        }}
        options={{
          tabBarAccessibilityLabel: "나눔",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              active="chatbubble"
              color={color}
              focused={focused}
              inactive="chatbubble-outline"
              size={ICON_SIZE}
            />
          ),
          title: "나눔",
        }}
      />
      <Tabs.Screen
        name="menu"
        listeners={{
          focus: () => rememberMainTab("menu"),
        }}
        options={{
          tabBarAccessibilityLabel: "전체",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              active="menu"
              color={color}
              focused={focused}
              inactive="menu-outline"
              size={ICON_SIZE}
            />
          ),
          title: "전체",
        }}
      />
    </Tabs>
  );
}

function MainDrawer({ isPermanent }: { isPermanent: boolean }) {
  const { rememberMainTab } = useMainTabHistory();
  const drawerContentContainerStyle = useResolveClassNames("pt-6");
  const drawerItemStyle = useResolveClassNames("mx-3 my-1 rounded-xl");
  const drawerLabelStyle = useResolveClassNames("font-brand-medium text-sm");
  const drawerStyle = useResolveClassNames(
    "w-[240px] border-r border-[rgba(3,26,23,0.1)] bg-white",
  );
  const headerStyle = useResolveClassNames("bg-white");
  const sceneStyle = useResolveClassNames("bg-[#EFF4F8]");

  return (
    <Drawer
      backBehavior="history"
      drawerContent={(props) => <MainDrawerContent {...props} />}
      initialRouteName="index"
      screenOptions={{
        drawerActiveBackgroundColor: "rgba(18, 133, 117, 0.12)",
        drawerActiveTintColor: HEADING,
        drawerContentContainerStyle,
        drawerInactiveTintColor: HEADING,
        drawerItemStyle,
        drawerLabelStyle,
        drawerStyle,
        drawerType: isPermanent ? "permanent" : "front",
        headerShown: !isPermanent,
        headerStyle,
        headerTintColor: HEADING,
        sceneStyle,
        swipeEnabled: !isPermanent,
      }}
    >
      <Drawer.Screen
        name="index"
        listeners={{
          focus: () => rememberMainTab("index"),
        }}
        options={{
          drawerIcon: ({ color, focused }) => (
            <TabIcon
              active="home"
              color={color}
              focused={focused}
              inactive="home-outline"
              size={ICON_SIZE}
            />
          ),
          drawerLabel: "홈",
          title: "홈",
        }}
      />
      <Drawer.Screen
        name="(diary)"
        options={{
          drawerIcon: ({ color, focused }) => (
            <TabIcon
              active="book"
              color={color}
              focused={focused}
              inactive="book-outline"
              size={ICON_SIZE}
            />
          ),
          drawerLabel: "일기",
          title: "일기",
        }}
      />
      <Drawer.Screen
        name="mokwon"
        listeners={{
          focus: () => rememberMainTab("mokwon"),
        }}
        options={{
          drawerIcon: ({ color, focused }) => (
            <TabIcon
              active="people"
              color={color}
              focused={focused}
              inactive="people-outline"
              size={ICON_SIZE}
            />
          ),
          drawerLabel: "목원",
          title: "목원",
        }}
      />
      <Drawer.Screen
        name="nanum"
        listeners={{
          focus: () => rememberMainTab("nanum"),
        }}
        options={{
          drawerIcon: ({ color, focused }) => (
            <TabIcon
              active="chatbubble"
              color={color}
              focused={focused}
              inactive="chatbubble-outline"
              size={ICON_SIZE}
            />
          ),
          drawerLabel: "나눔",
          title: "나눔",
        }}
      />
      <Drawer.Screen
        name="menu"
        listeners={{
          focus: () => rememberMainTab("menu"),
        }}
        options={{
          drawerIcon: ({ color, focused }) => (
            <TabIcon
              active="menu"
              color={color}
              focused={focused}
              inactive="menu-outline"
              size={ICON_SIZE}
            />
          ),
          drawerLabel: "전체",
          title: "전체",
        }}
      />
    </Drawer>
  );
}

function ResponsiveMainNavigator() {
  const { isMobile, usesPermanentSidebar } = useResponsiveLayout();

  return isMobile ? (
    <MainTabs />
  ) : (
    <MainDrawer isPermanent={usesPermanentSidebar} />
  );
}

export default function MainTabsLayout() {
  return (
    <MainTabHistoryProvider>
      <ResponsiveMainNavigator />
    </MainTabHistoryProvider>
  );
}
