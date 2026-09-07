import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Globe, ChevronDown, Check, Search, X } from 'lucide-react';
import './LanguageSelector.css';

interface LanguageSelectorProps {
  className?: string;
  isMobile?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className = '', isMobile = false }) => {
  const { currentLang, selectedLanguage, supportedLanguages, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const filteredLanguages = supportedLanguages.filter((lang) => {
    const q = searchFilter.toLowerCase();
    return (
      lang.name.toLowerCase().includes(q) ||
      lang.nativeName.toLowerCase().includes(q) ||
      lang.code.toLowerCase().includes(q)
    );
  });

  const handleSelectLanguage = (langCode: string) => {
    setLanguage(langCode);
    setIsOpen(false);
    setSearchFilter('');
  };

  return (
    <div
      ref={dropdownRef}
      className={`agri-lang-selector-wrapper ${isMobile ? 'mobile-mode' : ''} ${className}`}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="agri-lang-trigger-btn"
        title="Change Website Language (12 Languages)"
        aria-expanded={isOpen}
      >
        <span className="agri-lang-globe-icon">
          <Globe size={15} />
        </span>
        <span className="agri-lang-current-text">{selectedLanguage.nativeName}</span>
        <ChevronDown
          size={13}
          className={`agri-lang-chevron ${isOpen ? 'rotated' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="agri-lang-dropdown-menu animate-fade-in">
          {/* Header */}
          <div className="agri-lang-menu-header">
            <div className="agri-lang-menu-title-row">
              <span className="agri-lang-menu-title">Select Language</span>
              <span className="agri-lang-count-badge">12 Languages</span>
            </div>
            <span className="agri-lang-menu-subtitle">மொழியைத் தேர்ந்தெடுக்கவும்</span>

            {/* Quick Search Bar */}
            <div className="agri-lang-search-box">
              <Search size={14} className="agri-lang-search-icon" />
              <input
                type="text"
                placeholder="Search language..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                autoFocus
                className="agri-lang-search-input"
              />
              {searchFilter && (
                <button
                  type="button"
                  onClick={() => setSearchFilter('')}
                  className="agri-lang-search-clear"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Language Options List */}
          <div className="agri-lang-options-list">
            {filteredLanguages.length === 0 ? (
              <div className="agri-lang-empty">No languages found</div>
            ) : (
              filteredLanguages.map((lang) => {
                const isActive = lang.code === currentLang;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={`agri-lang-option-item ${isActive ? 'active' : ''}`}
                  >
                    <div className="agri-lang-item-left">
                      <span className="agri-lang-item-flag">{lang.flag}</span>
                      <div className="agri-lang-item-names">
                        <span className="agri-lang-item-native">{lang.nativeName}</span>
                        <span className="agri-lang-item-english">{lang.name}</span>
                      </div>
                    </div>
                    {isActive && (
                      <span className="agri-lang-active-check">
                        <Check size={14} strokeWidth={2.8} />
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Info */}
          <div className="agri-lang-menu-footer">
            <span>Powered by AgriEra Language Engine</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
