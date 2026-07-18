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
import { useResolveClassNames } from "uniwind";

import { PrayerIcon } from "@/components/navigation/PrayerIcon";
import {
  MainTabHistoryProvider,
  useMainTabHistory,
} from "@/context/MainTabHistoryContext";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

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

function useNavigationTokens() {
  const colorStyle = useResolveClassNames(
    "bg-fill-brand-weak text-text-heading",
  );
  const iconStyle = useResolveClassNames("size-icon-nav");

  return {
    activeBackgroundColor: colorStyle.backgroundColor as ColorValue,
    headingColor: colorStyle.color as ColorValue,
    iconSize: iconStyle.width as number,
  };
}

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
  size,
}: {
  color: ColorValue;
  focused: boolean;
  item: DiaryDrawerItem;
  size: number;
}) {
  if (item.route === "prayer") {
    return <PrayerIcon color={color} focused={focused} size={size} />;
  }

  return (
    <Ionicons
      color={color}
      name={focused ? item.activeIcon! : item.inactiveIcon!}
      size={size}
    />
  );
}

function MainDrawerContent(props: DrawerContentComponentProps) {
  const { activeBackgroundColor, headingColor, iconSize } =
    useNavigationTokens();
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
          <Ionicons color={color} name="arrow-back-outline" size={iconSize} />
        )}
        inactiveTintColor={headingColor}
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
            activeBackgroundColor={activeBackgroundColor}
            activeTintColor={headingColor}
            focused={focused}
            icon={({ color }) => (
              <DiaryDrawerIcon
                color={color}
                focused={focused}
                item={item}
                size={iconSize}
              />
            )}
            inactiveTintColor={headingColor}
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
  const { headingColor, iconSize } = useNavigationTokens();
  const { rememberMainTab } = useMainTabHistory();
  const { isMobile } = useResponsiveLayout();
  const segments = useSegments();
  const isMobileWeb = Platform.OS === "web" && isMobile;
  const isDiaryRoute = segments.some((segment) => segment === "(diary)");
  const headerTitleStyle = useResolveClassNames(
    "font-brand-bold text-xl text-text-heading",
  );
  const headerStyle = useResolveClassNames("bg-surface-header");
  const tabBarLabelStyle = useResolveClassNames("font-brand-medium text-label");
  const tabBarIconStyle = useResolveClassNames("mb-0.5 size-icon-nav");
  const tabBarStyle = useResolveClassNames(
    isMobileWeb
      ? "h-[calc(54px+env(safe-area-inset-bottom))] rounded-t-3xl border border-border-default bg-card pb-safe-or-2 pt-2 shadow-main-tab"
      : "rounded-t-3xl border border-border-default bg-card pb-safe-or-2 pt-2 shadow-main-tab",
  );
  const tabBarItemStyle = useResolveClassNames("items-center justify-center");
  const hiddenTabBarStyle = useResolveClassNames("hidden");

  return (
    <Tabs
      backBehavior="history"
      initialRouteName="index"
      screenOptions={{
        headerShown: true,
        headerStyle,
        headerTitleAlign: "left",
        headerTitleStyle: [headerTitleStyle, { includeFontPadding: false }],
        tabBarActiveTintColor: headingColor,
        tabBarInactiveTintColor: headingColor,
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
        tabBarStyle: isDiaryRoute ? hiddenTabBarStyle : tabBarStyle,
        tabBarItemStyle,
      }}
    >
      <Tabs.Screen
        name="index"
        listeners={{
          focus: () => rememberMainTab("index"),
        }}
        options={{
          headerTitle: "HCMS",
          tabBarAccessibilityLabel: "홈",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              active="home"
              color={color}
              focused={focused}
              inactive="home-outline"
              size={iconSize}
            />
          ),
          title: "홈",
        }}
      />
      <Tabs.Screen
        name="(diary)"
        options={{
          headerShown: false,
          tabBarAccessibilityLabel: "일기",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              active="book"
              color={color}
              focused={focused}
              inactive="book-outline"
              size={iconSize}
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
          headerTitle: "목원관리",
          tabBarAccessibilityLabel: "목원",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              active="people"
              color={color}
              focused={focused}
              inactive="people-outline"
              size={iconSize}
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
          headerTitle: "목장나눔터",
          tabBarAccessibilityLabel: "나눔",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              active="chatbubble"
              color={color}
              focused={focused}
              inactive="chatbubble-outline"
              size={iconSize}
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
              size={iconSize}
            />
          ),
          title: "전체",
        }}
      />
    </Tabs>
  );
}

function MainDrawer({ isPermanent }: { isPermanent: boolean }) {
  const { activeBackgroundColor, headingColor, iconSize } =
    useNavigationTokens();
  const { rememberMainTab } = useMainTabHistory();
  const drawerContentContainerStyle = useResolveClassNames("pt-6");
  const drawerItemStyle = useResolveClassNames("mx-3 my-1 rounded-xl");
  const drawerLabelStyle = useResolveClassNames("font-brand-medium text-sm");
  const drawerStyle = useResolveClassNames(
    "w-[240px] border-r border-border-default bg-card",
  );
  const headerStyle = useResolveClassNames("bg-surface-header");
  const sceneStyle = useResolveClassNames("bg-background");

  return (
    <Drawer
      backBehavior="history"
      drawerContent={(props) => <MainDrawerContent {...props} />}
      initialRouteName="index"
      screenOptions={{
        drawerActiveBackgroundColor: activeBackgroundColor,
        drawerActiveTintColor: headingColor,
        drawerContentContainerStyle,
        drawerInactiveTintColor: headingColor,
        drawerItemStyle,
        drawerLabelStyle,
        drawerStyle,
        drawerType: isPermanent ? "permanent" : "front",
        headerShown: !isPermanent,
        headerStyle,
        headerTintColor: headingColor,
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
              size={iconSize}
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
              size={iconSize}
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
              size={iconSize}
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
              size={iconSize}
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
              size={iconSize}
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
