import { Ionicons } from "@react-native-vector-icons/ionicons";
import { Stack, Tabs, useFocusEffect, useNavigation } from "expo-router";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  BackHandler,
  Platform,
  StyleSheet,
  type ColorValue,
} from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import { BottomTabBar } from "expo-router/js-tabs";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  ReduceMotion,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from "react-native-reanimated";
import { useCSSVariable, useResolveClassNames } from "uniwind";

import { PrayerIcon } from "@/components/navigation/PrayerIcon";
import {
  AnimatedTabIcon,
  HapticTabButton,
} from "@/components/navigation/HapticTabButton";
import { useMainTabHistory } from "@/context/MainTabHistoryContext";
import { useLeftEdgeSwipe } from "@/hooks/useLeftEdgeSwipe";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

const TAB_BAR_START_OFFSET = 120;
const ICON_GROW_START_DELAY = 100;
const EXIT_SCALE = 0.95;

function GrowingTabIcon({
  animate,
  children,
  delay,
}: {
  animate: boolean;
  children: ReactNode;
  delay: number;
}) {
  const scale = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    scale.value = 0;

    if (animate) {
      scale.value = withDelay(
        delay,
        withSpring(1, {
          damping: 14,
          mass: 0.7,
          reduceMotion: ReduceMotion.System,
          stiffness: 220,
        }),
      );
    }
  }, [animate, delay, scale]);

  return (
    <Animated.View style={animatedStyle}>
      <AnimatedTabIcon>{children}</AnimatedTabIcon>
    </Animated.View>
  );
}

function DiaryTabs({ onExit }: { onExit: () => void }) {
  const { getLastDiaryTab, rememberDiaryTab } = useMainTabHistory();
  const [animateIcons, setAnimateIcons] = useState(false);
  const tabBarOffset = useSharedValue(TAB_BAR_START_OFFSET);
  const tabBarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: tabBarOffset.value }],
  }));
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

  useFocusEffect(
    useCallback(() => {
      setAnimateIcons(false);
      tabBarOffset.value = TAB_BAR_START_OFFSET;
      tabBarOffset.value = withSpring(0, {
        damping: 17,
        mass: 0.8,
        reduceMotion: ReduceMotion.System,
        stiffness: 180,
      });
      setAnimateIcons(true);

      return () => {
        cancelAnimation(tabBarOffset);
        setAnimateIcons(false);
      };
    }, [tabBarOffset]),
  );

  return (
    <Tabs
      initialRouteName={getLastDiaryTab()}
      tabBar={(props) => (
        <Animated.View
          pointerEvents="box-none"
          style={[StyleSheet.absoluteFill, tabBarAnimatedStyle]}
        >
          <LinearGradient colors={gradientColors} style={gradientStyle} />

          <BottomTabBar {...props} />
        </Animated.View>
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
          <HapticTabButton
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
          </HapticTabButton>
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
            onExit();
          },
        }}
        options={{
          tabBarAccessibilityLabel: "메인 탭으로 돌아가기",
          tabBarButtonTestID: "diary-tab-back",
          tabBarButton: (props) => (
            <HapticTabButton
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
            </HapticTabButton>
          ),
          tabBarIconStyle: backTabBarIconStyle,
          tabBarIcon: () => (
            <AnimatedTabIcon>
              <Ionicons
                color={backIconColor}
                name="arrow-back-outline"
                size={iconSize}
              />
            </AnimatedTabIcon>
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
          tabBarButtonTestID: "diary-tab-index",
          tabBarItemStyle: [tabBarItemStyle, diaryTabBarItemStyle],
          tabBarIcon: ({ color, focused }) => (
            <GrowingTabIcon
              animate={animateIcons}
              delay={ICON_GROW_START_DELAY}
            >
              <Ionicons
                color={color}
                name={focused ? "book" : "book-outline"}
                size={iconSize}
              />
            </GrowingTabIcon>
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
          tabBarButtonTestID: "diary-tab-review",
          tabBarIcon: ({ color, focused }) => (
            <GrowingTabIcon
              animate={animateIcons}
              delay={ICON_GROW_START_DELAY + 40}
            >
              <Ionicons
                color={color}
                name={focused ? "file-tray-full" : "file-tray-full-outline"}
                size={iconSize}
              />
            </GrowingTabIcon>
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
          tabBarButtonTestID: "diary-tab-prayer",
          tabBarIcon: ({ color, focused }) => (
            <GrowingTabIcon
              animate={animateIcons}
              delay={ICON_GROW_START_DELAY + 80}
            >
              <PrayerIcon color={color} focused={focused} size={iconSize} />
            </GrowingTabIcon>
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
          tabBarButtonTestID: "diary-tab-mission",
          tabBarIcon: ({ color, focused }) => (
            <GrowingTabIcon
              animate={animateIcons}
              delay={ICON_GROW_START_DELAY + 120}
            >
              <Ionicons
                color={color}
                name={focused ? "earth" : "earth-outline"}
                size={iconSize}
              />
            </GrowingTabIcon>
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
  const mainNavigation = useNavigation("/(main)");
  const { getPreviousMainTab } = useMainTabHistory();
  const { usesPermanentSidebar, usesSidebar } = useResponsiveLayout();
  const swipeProgress = useSharedValue(0);
  const pageAnimatedStyle = useAnimatedStyle(() => ({
    opacity: 1 - swipeProgress.value,
    transform: [
      {
        scale: 1 - (1 - EXIT_SCALE) * swipeProgress.value,
      },
    ],
  }));
  const goBackToMain = useCallback(() => {
    mainNavigation.navigate(getPreviousMainTab() as never);
  }, [getPreviousMainTab, mainNavigation]);
  const edgeSwipe = useLeftEdgeSwipe({
    enabled: Platform.OS !== "web" && !usesPermanentSidebar,
    onSwipe: goBackToMain,
    progress: swipeProgress,
  });

  useFocusEffect(
    useCallback(() => {
      swipeProgress.value = 0;

      if (Platform.OS !== "android") {
        return;
      }

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          goBackToMain();
          return true;
        },
      );

      return () => subscription.remove();
    }, [goBackToMain, swipeProgress]),
  );

  return (
    <GestureDetector gesture={edgeSwipe}>
      <Animated.View style={[styles.page, pageAnimatedStyle]}>
        {usesSidebar ? <DiaryStack /> : <DiaryTabs onExit={goBackToMain} />}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
});
