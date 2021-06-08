import { Flex } from "@chakra-ui/react";
import {
  chakra,
  HTMLChakraProps,
  Interpolation,
  omitThemingProps,
  StylesProvider,
  SystemStyleObject,
  ThemingProps,
  useMultiStyleConfig,
  useStyles,
} from "@chakra-ui/system";
import React from "react";

import {
  getProgressProps,
  GetProgressPropsOptions,
  progress,
  stripe,
} from "./ProgressBar.utils";

export type ProgressLabelProps = HTMLChakraProps<"div">;

/**
 * ProgressLabel is used to show the numeric value of the progress.
 * @see Docs https://chakra-ui.com/docs/feedback/progress
 */
export const ProgressLabel: React.FC<ProgressLabelProps> = (props) => {
  const styles = useStyles();
  const labelStyles: SystemStyleObject = {
    top: "50%",
    left: "50%",
    width: "100%",
    textAlign: "center",
    position: "absolute",
    transform: "translate(-50%, -50%)",
    ...styles.label,
  };
  return <chakra.div {...props} __css={labelStyles} />;
};

export interface ProgressFilledTrackProps
  extends HTMLChakraProps<"div">,
    GetProgressPropsOptions {}

/**
 * ProgressFilledTrack (Linear)
 *
 * The progress component that visually indicates the current level of the progress bar.
 * It applies `background-color` and changes its width.
 *
 * @see Docs https://chakra-ui.com/docs/components/progress
 */
const ProgressFilledTrack = (props: ProgressFilledTrackProps): JSX.Element => {
  const { min, max, value, buffer, isIndeterminate, ...rest } = props;
  const progressProps = getProgressProps({
    value,
    buffer,
    min,
    max,
    isIndeterminate,
  });

  const styles = useStyles();
  const trackStyles = {
    height: "100%",
    ...styles.filledTrack,
  };

  return (
    <Flex h="100%">
      <chakra.div
        style={{
          width: `${progressProps.percent}%`,
          ...rest.style,
        }}
        {...progressProps.bind}
        {...rest}
        __css={trackStyles}
      />
      <chakra.div
        style={{
          width: `${progressProps.bufferPercent}%`,
          ...rest.style,
        }}
        {...rest}
        __css={{ ...trackStyles, opacity: 0.2 }}
      />
    </Flex>
  );
};

export type ProgressTrackProps = HTMLChakraProps<"div">;

interface ProgressOptions {
  /**
   * The `value` of the progress indicator.
   * If `undefined` the progress bar will be in `indeterminate` state
   */
  value?: number;
  /**
   * The buffer value of the progress indicator.
   */
  buffer?: number;
  /**
   * The minimum value of the progress
   */
  min?: number;
  /**
   * The maximum value of the progress
   */
  max?: number;
  /**
   * If `true`, the progress bar will show stripe
   */
  hasStripe?: boolean;
  /**
   * If `true`, and hasStripe is `true`, the stripes will be animated
   */
  isAnimated?: boolean;
  /**
   * If `true`, the progress will be indeterminate and the `value`
   * prop will be ignored
   */
  isIndeterminate?: boolean;
}

export interface ProgressProps
  extends ProgressOptions,
    ThemingProps<"Progress">,
    HTMLChakraProps<"div"> {}

/**
 * Progress (Linear)
 *
 * Progress is used to display the progress status for a task that takes a long
 * time or consists of several steps.
 *
 * It includes accessible attributes to help assistive technologies understand
 * and speak the progress values.
 *
 * @see Docs https://chakra-ui.com/docs/components/progress
 */
export const Progress: React.FC<ProgressProps> = (props) => {
  const {
    value,
    buffer,
    min = 0,
    max = 100,
    hasStripe,
    isAnimated,
    children,
    borderRadius: propBorderRadius,
    isIndeterminate,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    ...rest
  } = omitThemingProps(props);

  const styles = useMultiStyleConfig("Progress", props);

  const borderRadius =
    propBorderRadius ??
    (styles.track?.borderRadius as string | number | undefined);

  const stripAnimation = { animation: `${stripe} 1s linear infinite` };

  /**
   * We should not use stripe if it is `indeterminate`
   */
  const shouldAddStripe = !isIndeterminate && hasStripe;

  const shouldAnimateStripe = shouldAddStripe && isAnimated;

  /**
   * Generate styles for stripe and stripe animation
   */
  const css: Interpolation<unknown> = {
    ...(shouldAnimateStripe && stripAnimation),
    ...(isIndeterminate && {
      position: "absolute",
      willChange: "left",
      minWidth: "50%",
      animation: `${progress} 1s ease infinite normal none running`,
    }),
  };

  const trackStyles: SystemStyleObject = {
    overflow: "hidden",
    position: "relative",
    ...styles.track,
  };

  return (
    <chakra.div borderRadius={borderRadius} __css={trackStyles} {...rest}>
      <StylesProvider value={styles}>
        <ProgressFilledTrack
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          min={min}
          max={max}
          value={value}
          buffer={buffer}
          isIndeterminate={isIndeterminate}
          css={css}
          borderRadius={borderRadius}
        />
        {children}
      </StylesProvider>
    </chakra.div>
  );
};
