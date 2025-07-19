import * as React from "react";
import { TextInput, type TextInputProps } from "react-native";
import { cn } from "../../lib/utils";

function Input({
  className,
  placeholderClassName,
  ...props
}: TextInputProps & {
  ref?: React.RefObject<TextInput>;
}) {
  return (
    <TextInput
      style={{ fontFamily: "Nunito_400Regular", borderRadius: 12 }}
      className={cn(
        "flex h-10 dark:border-gray-700 dark:bg-gray-800 native:h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground placeholder:text-muted-foreground ring-offset-background",
        props.editable === false && "opacity-50 cursor-not-allowed",
        className
      )}
      placeholderClassName={cn("dark:text-gray-400", placeholderClassName)}
      {...props}
    />
  );
}

export { Input };
