import { useIntl } from "react-intl";

export function useTranslations() {
  const intl = useIntl();

  return {
    formatMessage: intl.formatMessage,
    formatDate: intl.formatDate,
    formatTime: intl.formatTime,
    formatNumber: intl.formatNumber,
    formatPlural: intl.formatPlural,
  };
}
