export const formatDateTime = (value?: string | Date) => {
    if (!value) return "-";

    const date = new Date(value);

    return date.toLocaleString("en-GB", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
};