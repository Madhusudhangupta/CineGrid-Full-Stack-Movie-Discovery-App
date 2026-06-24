import { useAuth } from '@/hooks/useAuth';

export default function Achievements() {
  const { user } = useAuth();
  
  const achievements = user?.achievements || [];

  if (achievements.length === 0) {
    return (
      <p className="text-sm text-slate-500 p-4">
        No achievements yet. Keep reviewing and watching to earn badges!
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {achievements.map((achievement, index) => (
        <div 
          key={index} 
          className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 text-center transition-transform hover:scale-105"
        >
          <div className="text-4xl mb-2">{achievement.icon || '🏆'}</div>
          <h3 className="font-semibold text-sm text-slate-900 dark:text-white">{achievement.name}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{achievement.description}</p>
        </div>
      ))}
    </div>
  );
}