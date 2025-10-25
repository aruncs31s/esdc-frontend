import { useState } from 'react';
import {
  FiCheckCircle,
  FiDownload,
  FiCode,
  FiPackage,
  FiCheckSquare,
  FiAlertCircle,
  FiUploadCloud,
  FiServer,
  FiTool,
  FiBook,
  FiSearch,
  FiChevronRight,
  FiCopy,
  FiCheck,
  FiMap,
  FiFileText,
  FiExternalLink,
} from 'react-icons/fi';
import buildDocumentation from '../data/buildDocumentation.json';
import routesDataJson from '../data/routesData.json';
import docsFiles from '../data/docsFiles.json';
import '../styles/build.css';

interface ContentItem {
  type: string;
  text?: string;
  items?: string[] | ContentItem[];
  code?: string;
  language?: string;
  number?: number;
  title?: string;
  solution?: string;
}

interface Section {
  id: string;
  title: string;
  icon: string;
  content: ContentItem[];
}

interface Route {
  path: string;
  name: string;
  description: string;
  feature?: string;
  protected?: boolean;
  role?: string;
}

interface RouteCategory {
  name: string;
  routes: Route[];
}

interface RoutesData {
  title: string;
  description: string;
  categories: RouteCategory[];
}

const routesData = routesDataJson as RoutesData;

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  FiCheckCircle,
  FiDownload,
  FiCode,
  FiPackage,
  FiCheckSquare,
  FiAlertCircle,
  FiUploadCloud,
  FiServer,
  FiTool,
  FiMap,
  FiFileText,
};

export default function Build() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('prerequisites');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const sections: Section[] = buildDocumentation.sections;

  const filteredSections = sections.filter(
    (section) =>
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.content.some((item) => item.text?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const renderContent = (item: ContentItem, index: number) => {
    const itemId = `${activeSection}-${index}`;

    switch (item.type) {
      case 'paragraph':
        return (
          <p key={index} className="build-paragraph">
            {item.text}
          </p>
        );

      case 'list':
        return (
          <ul key={index} className="build-list">
            {item.items?.map((listItem, i) => (
              <li key={i}>{typeof listItem === 'string' ? listItem : ''}</li>
            ))}
          </ul>
        );

      case 'code':
        return (
          <div key={index} className="build-code-block">
            <div className="code-header">
              <span className="code-language">{item.language || 'bash'}</span>
              <button
                className="copy-button"
                onClick={() => handleCopyCode(item.code || '', itemId)}
                title="Copy code"
              >
                {copiedCode === itemId ? (
                  <>
                    <FiCheck size={16} /> Copied!
                  </>
                ) : (
                  <>
                    <FiCopy size={16} /> Copy
                  </>
                )}
              </button>
            </div>
            <pre>
              <code>{item.code}</code>
            </pre>
          </div>
        );

      case 'step':
        return (
          <div key={index} className="build-step">
            <div className="step-number">{item.number}</div>
            <div className="step-content">
              <h4>{item.title}</h4>
              {item.text && <p>{item.text}</p>}
              {item.code && (
                <div className="build-code-block">
                  <div className="code-header">
                    <span className="code-language">bash</span>
                    <button
                      className="copy-button"
                      onClick={() => handleCopyCode(item.code || '', `${itemId}-step`)}
                      title="Copy code"
                    >
                      {copiedCode === `${itemId}-step` ? (
                        <>
                          <FiCheck size={16} /> Copied!
                        </>
                      ) : (
                        <>
                          <FiCopy size={16} /> Copy
                        </>
                      )}
                    </button>
                  </div>
                  <pre>
                    <code>{item.code}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        );

      case 'note':
        return (
          <div key={index} className="build-note">
            <FiAlertCircle size={20} />
            <p>{item.text}</p>
          </div>
        );

      case 'subsection':
        return (
          <div key={index} className="build-subsection">
            <h4>{item.title}</h4>
            {item.items?.map((subItem, i) => renderContent(subItem as ContentItem, i))}
          </div>
        );

      case 'option':
        return (
          <div key={index} className="build-option">
            <h5>{item.title}</h5>
            <ul>
              {item.items?.map((optItem, i) => (
                <li key={i}>{typeof optItem === 'string' ? optItem : ''}</li>
              ))}
            </ul>
          </div>
        );

      case 'issue':
        return (
          <div key={index} className="build-issue">
            <div className="issue-title">
              <FiTool size={18} />
              <strong>{item.title}</strong>
            </div>
            <div className="issue-solution">
              <span className="solution-label">Solution:</span> {item.solution}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const currentSection = sections.find((s) => s.id === activeSection);
  const PageIcon = FiBook;

  return (
    <div className="build-page">
      <div className="build-sidebar">
        <div className="sidebar-search">
          <FiSearch />
          <input
            type="text"
            placeholder="Search documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <nav className="build-nav">
          {filteredSections.map((section) => {
            const SectionIcon = iconMap[section.icon] || FiBook;
            return (
              <button
                key={section.id}
                className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <SectionIcon size={18} />
                <span>{section.title}</span>
                <FiChevronRight size={14} className="nav-arrow" />
              </button>
            );
          })}
        </nav>
      </div>

      <div className="build-content">
        {currentSection && (
          <div className="build-section">
            <div className="build-header">
              <PageIcon size={32} />
              <div>
                <h1>{currentSection.title}</h1>
              </div>
            </div>
            <div className="section-content">
              {currentSection.content.map((item, index) => renderContent(item, index))}

              {/* Render routes if in routes section */}
              {currentSection.id === 'routes' && (
                <div className="routes-grid">
                  {routesData.categories.map((category, idx) => (
                    <div key={idx} className="route-category">
                      <h3>{category.name}</h3>
                      <div className="routes-list">
                        {category.routes.map((route, ridx) => (
                          <div key={ridx} className="route-item">
                            <code className="route-path">{route.path}</code>
                            <div className="route-info">
                              <div className="route-name">{route.name}</div>
                              <div className="route-description">{route.description}</div>
                            </div>
                            {route.feature && (
                              <span className="route-badge">Feature: {route.feature}</span>
                            )}
                            {route.protected && <span className="route-badge">Protected</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Render docs files if in markdown-docs section */}
              {currentSection.id === 'markdown-docs' && (
                <div className="docs-grid">
                  {docsFiles.categories.map((category, idx) => (
                    <div key={idx} className="docs-category">
                      <h3>{category.name}</h3>
                      <div className="docs-list">
                        {category.files.map((file, fidx) => (
                          <a
                            key={fidx}
                            href={`https://github.com/aruncs31s/esdc-frontend/blob/main/docs/${file.path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="doc-item"
                          >
                            <div className="doc-item-header">
                              <FiFileText className="doc-item-icon" size={16} />
                              <span className="doc-title">{file.title}</span>
                              <FiExternalLink size={12} style={{ marginLeft: 'auto' }} />
                            </div>
                            <code className="doc-path">{file.path}</code>
                            <div className="doc-description">{file.description}</div>
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {!currentSection && (
          <div className="no-results">
            <FiSearch size={48} />
            <p>No documentation found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
