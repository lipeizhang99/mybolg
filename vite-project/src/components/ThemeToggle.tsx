import { useAppDispatch, useAppSelector } from '../store'
import { toggleTheme } from '../store/slices/themeSlice'
import { MoonOutlined, SunOutlined } from '@ant-design/icons'
import './ThemeToggle.css'

export default function ThemeToggle() {
  const themeMode = useAppSelector((state) => state.theme.mode)
  const dispatch = useAppDispatch()
  const isDark = themeMode === 'dark'

  return (
    <div className="theme-toggle-wrapper">
      <button
        className={`theme-toggle ${isDark ? 'dark' : 'light'}`}
        onClick={() => dispatch(toggleTheme())}
        aria-label={isDark ? '切换到浅色模式' : '切换到深色模式'}
        title={isDark ? '切换到浅色模式' : '切换到深色模式'}
      >
        <div className="theme-toggle-track">
          <div className="theme-toggle-thumb">
            {isDark ? (
              <MoonOutlined className="theme-icon" />
            ) : (
              <SunOutlined className="theme-icon" />
            )}
          </div>
        </div>
      </button>
    </div>
  )
}

