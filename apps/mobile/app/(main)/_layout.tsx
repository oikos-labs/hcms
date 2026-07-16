import {
  Ionicons,
  type IoniconsIconName,
} from "@react-native-vector-icons/ionicons";
import { Tabs } from "expo-router";
import { Pressable, type ColorValue } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  MainTabHistoryProvider,
  useMainTabHistory,
} from "@/context/MainTabHistoryContext";

const HEADING = "#031A17";
const BORDER_DEFAULT = "rgba(3, 26, 23, 0.1)";
const ICON_SIZE = 22;

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

function MainTabs() {
  const insets = useSafeAreaInsets();
  const { rememberMainTab } = useMainTabHistory();

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
            android_ripple={props.android_ripple}
            disabled={props.disabled}
            onLongPress={props.onLongPress}
            onPress={(event) => props.onPress?.(event)}
            role={props.role}
            style={({ pressed }) => [
              props.style,
              {
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
              },
              pressed && { opacity: 0.7 },
            ]}
            testID={props.testID}
          >
            {props.children}
          </Pressable>
        ),
        tabBarLabelStyle: {
          fontFamily: "Pretendard",
          fontSize: 11,
          fontWeight: "500",
          includeFontPadding: false,
          lineHeight: 13,
        },
        tabBarLabelPosition: "below-icon",
        tabBarIconStyle: {
          height: ICON_SIZE,
          marginBottom: 2,
          width: ICON_SIZE,
        },
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderWidth: 1,
          borderColor: BORDER_DEFAULT,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          elevation: 12,
          height: 48 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 8,
          shadowColor: HEADING,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.04,
          shadowRadius: 10,
        },
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
        },
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
          tabBarStyle: { display: "none" },
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

export default function MainTabsLayout() {
  return (
    <MainTabHistoryProvider>
      <MainTabs />
    </MainTabHistoryProvider>
  );
}
