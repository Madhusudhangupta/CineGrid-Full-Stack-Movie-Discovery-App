
import { useTranslation } from 'react-i18next';

export default function ShareButtons({ url, title }) {
  const { t } = useTranslation();

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`);
  };

  return (
    <div className="flex space-x-2 my-4">
      <button onClick={shareToTwitter} className="bg-blue-500 text-white p-2 rounded">
        {t('shareTwitter')}
      </button>
    </div>
  );
}