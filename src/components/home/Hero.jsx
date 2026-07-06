import { Search } from 'lucide-react'
import { useState } from 'react'
import heroImage from '../../assets/images/hero.png'
import { popularSearches, searchSuggestions, trustStats } from '../../data/homeData'

export default function Hero() {
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  return (
    <section className="hero">
      <div className="container hero-layout">
        <div className="hero-text">
          <h1 className="hero-title">متخصصی که دستگاه شما را می‌شناسد پیدا کنید</h1>
          <p className="hero-subtitle">
            کارخانه‌ها را به نیروهای فنی متصل می‌کنیم که تجربه واقعی کار با ماشین‌آلات و تجهیزات صنعتی شما را
            دارند
          </p>

          <div className="search-wrapper">
            <div className={`search-bar ${searchFocused ? 'focused' : ''}`}>
              <Search size={20} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="جستجوی متخصص، دستگاه یا برند..."
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              />
              <button type="button" className="search-btn" aria-label="جستجو">
                جستجو
              </button>
            </div>

            {searchFocused && searchValue.length === 0 && (
              <div className="search-suggestions">
                {searchSuggestions.map((suggestion) => (
                  <div
                    key={suggestion}
                    className="suggestion-item"
                    onMouseDown={() => setSearchValue(suggestion)}
                  >
                    <Search size={14} />
                    <span>{suggestion}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="popular-searches">
            <span className="popular-label">جستجوهای پرطرفدار:</span>
            {popularSearches.map((tag) => (
              <button key={tag} type="button" className="tag-btn">
                {tag}
              </button>
            ))}
          </div>

          <div className="trust-strip">
            {trustStats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.id} className="trust-stat">
                  <Icon size={16} />
                  <span>{stat.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="hero-visual">
          <img src={heroImage} alt="صنعت‌نت" className="hero-image" />
        </div>
      </div>
    </section>
  )
}
