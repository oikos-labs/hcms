import { Ionicons } from "@react-native-vector-icons/ionicons";
import { Stack, Tabs, useNavigation } from "expo-router";
import { Pressable, type ColorValue } from "react-native";
import { BottomTabBar } from "expo-router/js-tabs";
import { LinearGradient } from "expo-linear-gradient";
import { useCSSVariable, useResolveClassNames } from "uniwind";

import { PrayerIcon } from "@/components/navigation/PrayerIcon";
import { useMainTabHistory } from "@/context/MainTabHistoryContext";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

function DiaryTabs() {
  const mainTabsNavigation = useNavigation("/(main)");
  const { getLastDiaryTab, getPreviousMainTab, rememberDiaryTab } =
    useMainTabHistory();
  const navigationTokenStyle = useResolveClassNames(
    "size-icon-nav text-text-heading",
  );
  const backIconColorStyle = useResolveClassNames("text-icon-default");
  const headingColor = navigationTokenStyle.color as ColorValue;
  const backIconColor = backIconColorStyle.color as ColorValue;
  const iconSize = navigationTokenStyle.width as number;
  const headerTitleStyle = useResolveClassNames(
    "font-brand-bold text-xl text-text-heading",
  );
  const headerStyle = useResolveClassNames("bg-surface-header");
  const tabBarLabelStyle = useResolveClassNames("font-brand-medium text-label");
  const tabBarIconStyle = useResolveClassNames("mb-0.5 size-icon-nav");
  const tabBarItemStyle = useResolveClassNames(
    "h-[60px] items-center justify-center py-0",
  );
  const tabBarStyle = useResolveClassNames(
    "absolute bottom-safe-or-4 mx-[2.5%] h-[60px] w-[95%] rounded-full border border-border-default bg-card py-0 shadow-diary-tab",
  );
  const gradientStyle = useResolveClassNames(
    "pointer-events-none absolute inset-x-0 bottom-0 h-[calc(60px+max(env(safe-area-inset-bottom),16px))]",
  );
  const backTabBarIconStyle = useResolveClassNames("size-icon-nav");
  const backTabBarItemStyle = useResolveClassNames(
    "absolute left-2 top-2 z-[1] size-11 items-center justify-center rounded-full bg-fill-neutral-weak",
  );
  const diaryTabBarItemStyle = useResolveClassNames("ml-[60px]");
  const gradientColors = useCSSVariable([
    "--navigation-gradient-start",
    "--navigation-gradient-middle",
    "--navigation-gradient-strong",
    "--navigation-gradient-end",
  ]) as [ColorValue, ColorValue, ColorValue, ColorValue];

  return (
    <Tabs
      initialRouteName={getLastDiaryTab()}
      tabBar={(props) => (
        <>
          <LinearGradient colors={gradientColors} style={gradientStyle} />

          <BottomTabBar {...props} />
        </>
      )}
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
        tabBarItemStyle,
        tabBarStyle,
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
              color={backIconColor}
              name="arrow-back-outline"
              size={iconSize}
            />
          ),
          tabBarItemStyle: backTabBarItemStyle,
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="index"
        listeners={{
          focus: () => rememberDiaryTab("index"),
        }}
        options={{
          headerTitle: "목회일기",
          tabBarAccessibilityLabel: "일기",
          tabBarItemStyle: [tabBarItemStyle, diaryTabBarItemStyle],
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              color={color}
              name={focused ? "book" : "book-outline"}
              size={iconSize}
            />
          ),
          title: "일기",
        }}
      />
      <Tabs.Screen
        name="review"
        listeners={{
          focus: () => rememberDiaryTab("review"),
        }}
        options={{
          headerTitle: "목회일기 검토",
          tabBarAccessibilityLabel: "검토",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              color={color}
              name={focused ? "file-tray-full" : "file-tray-full-outline"}
              size={iconSize}
            />
          ),
          title: "검토",
        }}
      />
      <Tabs.Screen
        name="prayer"
        listeners={{
          focus: () => rememberDiaryTab("prayer"),
        }}
        options={{
          headerTitle: "기도제목",
          tabBarAccessibilityLabel: "기도",
          tabBarIcon: ({ color, focused }) => (
            <PrayerIcon color={color} focused={focused} size={iconSize} />
          ),
          title: "기도",
        }}
      />
      <Tabs.Screen
        name="mission"
        listeners={{
          focus: () => rememberDiaryTab("mission"),
        }}
        options={{
          headerTitle: "선교관리",
          tabBarAccessibilityLabel: "선교",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              color={color}
              name={focused ? "earth" : "earth-outline"}
              size={iconSize}
            />
          ),
          title: "선교",
        }}
      />
    </Tabs>
  );
}

function DiaryStack() {
  const { getLastDiaryTab, rememberDiaryTab } = useMainTabHistory();

  return (
    <Stack
      initialRouteName={getLastDiaryTab()}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="back_action" />
      <Stack.Screen
        listeners={{ focus: () => rememberDiaryTab("index") }}
        name="index"
      />
      <Stack.Screen
        listeners={{ focus: () => rememberDiaryTab("review") }}
        name="review"
      />
      <Stack.Screen
        listeners={{ focus: () => rememberDiaryTab("prayer") }}
        name="prayer"
      />
      <Stack.Screen
        listeners={{ focus: () => rememberDiaryTab("mission") }}
        name="mission"
      />
    </Stack>
  );
}

export default function DiaryLayout() {
  const { usesSidebar } = useResponsiveLayout();

  return usesSidebar ? <DiaryStack /> : <DiaryTabs />;
}
