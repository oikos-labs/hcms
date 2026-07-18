import { Ionicons } from "@react-native-vector-icons/ionicons";
import { Stack, Tabs, useNavigation } from "expo-router";
import { Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useResolveClassNames } from "uniwind";

import { PrayerIcon } from "@/components/navigation/PrayerIcon";
import { useMainTabHistory } from "@/context/MainTabHistoryContext";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

const HEADING = "#031A17";
const NEUTRAL_GRAY = "#3A4D4B";
const ICON_SIZE = 22;
const TAB_BAR_HEIGHT = 60;
const BACK_BUTTON_SIZE = 44;
const BACK_BUTTON_INSET = (TAB_BAR_HEIGHT - BACK_BUTTON_SIZE) / 2;

function DiaryTabs() {
  const mainTabsNavigation = useNavigation("/(main)");
  const insets = useSafeAreaInsets();
  const { getPreviousMainTab } = useMainTabHistory();
  const tabBarLabelStyle = useResolveClassNames(
    "font-brand-medium text-[11px] leading-[13px]",
  );
  const tabBarIconStyle = useResolveClassNames("mb-0.5 size-[22px]");
  const tabBarItemStyle = useResolveClassNames(
    "h-[60px] items-center justify-center py-0",
  );
  const tabBarStyle = useResolveClassNames(
    "absolute mx-[2.5%] h-[60px] w-[95%] rounded-full border border-[rgba(3,26,23,0.1)] bg-white py-0",
  );
  const backTabBarIconStyle = useResolveClassNames("size-[22px]");
  const backTabBarItemStyle = useResolveClassNames(
    "absolute z-[1] size-11 items-center justify-center rounded-full bg-[rgba(3,26,23,0.05)]",
  );
  const diaryTabBarItemStyle = useResolveClassNames("ml-[60px]");

  return (
    <Tabs
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
        tabBarItemStyle,
        tabBarStyle: [
          tabBarStyle,
          {
            bottom: Math.max(insets.bottom, 16),
            elevation: 8,
            shadowColor: HEADING,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.14,
            shadowRadius: 8,
          },
        ],
      }}
    >
      <Tabs.Screen
        name="back_action"
        listeners={{
          tabPress: (event) => {
            event.preventDefault();
            mainTabsNavigation.navigate(getPreviousMainTab() as never);
          },
        }}
        options={{
          tabBarAccessibilityLabel: "메인 탭으로 돌아가기",
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
              className="size-11 items-center justify-center p-0 active:opacity-70"
              onLongPress={props.onLongPress}
              onPress={(event) => props.onPress?.(event)}
              role={props.role}
              testID={props.testID}
            >
              {props.children}
            </Pressable>
          ),
          tabBarIconStyle: backTabBarIconStyle,
          tabBarIcon: () => (
            <Ionicons
              color={NEUTRAL_GRAY}
              name="arrow-back-outline"
              size={ICON_SIZE}
            />
          ),
          tabBarItemStyle: [
            backTabBarItemStyle,
            { left: BACK_BUTTON_INSET, top: BACK_BUTTON_INSET },
          ],
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          tabBarAccessibilityLabel: "일기",
          tabBarItemStyle: [tabBarItemStyle, diaryTabBarItemStyle],
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              color={color}
              name={focused ? "book" : "book-outline"}
              size={ICON_SIZE}
            />
          ),
          title: "일기",
        }}
      />
      <Tabs.Screen
        name="review"
        options={{
          tabBarAccessibilityLabel: "검토",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              color={color}
              name={focused ? "file-tray-full" : "file-tray-full-outline"}
              size={ICON_SIZE}
            />
          ),
          title: "검토",
        }}
      />
      <Tabs.Screen
        name="prayer"
        options={{
          tabBarAccessibilityLabel: "기도",
          tabBarIcon: ({ color, focused }) => (
            <PrayerIcon color={color} focused={focused} size={ICON_SIZE} />
          ),
          title: "기도",
        }}
      />
      <Tabs.Screen
        name="mission"
        options={{
          tabBarAccessibilityLabel: "선교",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              color={color}
              name={focused ? "earth" : "earth-outline"}
              size={ICON_SIZE}
            />
          ),
          title: "선교",
        }}
      />
    </Tabs>
  );
}

function DiaryStack() {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="back_action" />
      <Stack.Screen name="index" />
      <Stack.Screen name="review" />
      <Stack.Screen name="prayer" />
      <Stack.Screen name="mission" />
    </Stack>
  );
}

export default function DiaryLayout() {
  const { usesSidebar } = useResponsiveLayout();

  return usesSidebar ? <DiaryStack /> : <DiaryTabs />;
}
