"use client";

import { Combobox as ChakraCombobox, Portal } from "@chakra-ui/react";
import { CloseButton } from "./close-button";
import * as React from "react";
import { IoChevronDown } from "react-icons/io5";

interface ComboboxControlProps extends ChakraCombobox.ControlProps {
  clearable?: boolean;
  disabled?: boolean;
}

export const ComboboxControl = React.forwardRef<
  HTMLDivElement,
  ComboboxControlProps
>(function ComboboxControl(props, ref) {
  const { children, clearable, disabled, ...rest } = props;
  return (
    <ChakraCombobox.Control
      {...rest}
      ref={ref}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        width: "100%",
      }}
    >
      {children}
      <ChakraCombobox.IndicatorGroup
        style={{
          position: "absolute",
          right: "10px",
          display: "flex",
          gap: "4px",
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            pointerEvents: "auto",
            display: "flex",
            gap: "4px",
            alignItems: "center",
          }}
        >
          {clearable && <ComboboxClearTrigger disabled={disabled}/>}
          <ChakraCombobox.Trigger disabled={disabled}>
            <IoChevronDown />
          </ChakraCombobox.Trigger>
        </div>
      </ChakraCombobox.IndicatorGroup>
    </ChakraCombobox.Control>
  );
});

export const ComboboxInput = React.forwardRef<
  HTMLInputElement,
  ChakraCombobox.InputProps
>(function ComboboxInput(props, ref) {
  const { disabled, ...rest } = props;
  return (
    <ChakraCombobox.Input
      {...props}
      ref={ref}
      borderWidth="1px"
      borderRadius="sm"
      height="10"
      px={3}
      pe="55px"
      width="100%"
      _focusVisible={{ outline: "2px solid", outlineColor: "black" }}
      bg={"rgba(0,0,0,0)"}
      _disabled={{
        cursor: "not-allowed",
        bg: "gray.100",
        color: "gray.500",
        _placeholder: {
          color: "gray.400",
        },
      }}
    >
    </ChakraCombobox.Input>
  );
});

const ComboboxClearTrigger = React.forwardRef<
  HTMLButtonElement,
  ChakraCombobox.ClearTriggerProps
>(function ComboboxClearTrigger(props, ref) {
  const { disabled, ...rest } = props;
  return (
    <ChakraCombobox.ClearTrigger asChild {...props} ref={ref}>
      <CloseButton
        size="xs"
        variant="plain"
        focusVisibleRing="inside"
        focusRingWidth="2px"
        pointerEvents="auto"
        _disabled={{
          opacity: 0.5,
          cursor: "not-allowed",
        }}
      />
    </ChakraCombobox.ClearTrigger>
  );
});

interface ComboboxContentProps extends ChakraCombobox.ContentProps {
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement | null>;
}

export const ComboboxContent = React.forwardRef<
  HTMLDivElement,
  ComboboxContentProps
>(function ComboboxContent(props, ref) {
  const { portalled = true, portalRef, ...rest } = props;
  return (
    <Portal disabled={!portalled} container={portalRef}>
      <ChakraCombobox.Positioner>
        <ChakraCombobox.Content
          {...rest}
          ref={ref}
          zIndex={"popover"}
          bg={"white"}
          style={{ maxHeight: "250px", overflowY: "auto" }}
          boxShadow="md"
          borderWidth="1px"
          borderColor="gray.200"
        />
      </ChakraCombobox.Positioner>
    </Portal>
  );
});

export const ComboboxItem = React.forwardRef<
  HTMLDivElement,
  ChakraCombobox.ItemProps
>(function ComboboxItem(props, ref) {
  const { item, children, ...rest } = props;
  return (
    <ChakraCombobox.Item
      key={item.value}
      item={item}
      {...rest}
      ref={ref}
      zIndex={"popover"}
      px={4}
      py={2}
      cursor="pointer"
      _hover={{ bg: "success.100", color: "black" }}
      _highlighted={{ bg: "success.100", color: "black" }}
      fontSize={"sm"}
      display={"flex"}
      justifyContent={"space-between"}
      flexDirection={"row"}
      /* _checked={{ bg: "success.300", color: "black" }} */ //Verificar si queda esto o no
    >
      {children}
      <ChakraCombobox.ItemIndicator />
    </ChakraCombobox.Item>
  );
});

export const ComboboxRoot = React.forwardRef<
  HTMLDivElement,
  ChakraCombobox.RootProps
>(function ComboboxRoot(props, ref) {
  const { disabled, ...rest } = props;
  return (
    <ChakraCombobox.Root
      {...props}
      ref={ref}
      positioning={{ sameWidth: true, ...props.positioning }}
      _disabled={{
        "& [data-trigger]": {
          cursor: "not-allowed",
        },
      }}
    />
  );
}) as ChakraCombobox.RootComponent;

interface ComboboxItemGroupProps extends ChakraCombobox.ItemGroupProps {
  label: React.ReactNode;
}

export const ComboboxItemGroup = React.forwardRef<
  HTMLDivElement,
  ComboboxItemGroupProps
>(function ComboboxItemGroup(props, ref) {
  const { children, label, ...rest } = props;
  return (
    <ChakraCombobox.ItemGroup {...rest} ref={ref}>
      <ChakraCombobox.ItemGroupLabel>{label}</ChakraCombobox.ItemGroupLabel>
      {children}
    </ChakraCombobox.ItemGroup>
  );
});

export const ComboboxLabel = ChakraCombobox.Label;
export const ComboboxEmpty = ChakraCombobox.Empty;
export const ComboboxItemText = ChakraCombobox.ItemText;
