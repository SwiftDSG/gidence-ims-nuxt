export default function () {
  const rem = useState<number>("rem", () => 24);
  const view = useState<"large" | "medium" | "small">("view", () => "large");
  const theme = useState<"light" | "dark">("theme", () => "dark");
  const navigation = useState<"collapsed" | "expanded">("navigation", () => "expanded");

  return {
    rem,
    view,
    theme,
    navigation,
  };
}
