import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Heading from '@theme/Heading';

import { styles } from '@/styles/components/homepage-header';

/**
 * Homepage header.
 *
 * @constructor
 *
 * @since 1.0.0
 */
export function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <header className="hero hero--primary" style={styles['heroBanner']}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">
          {siteConfig.tagline}
        </p>
        <div style={styles['buttons']}>
          <Link className="button button--secondary button--lg" to="/docs/quickstart/">
            Get Started 👏
          </Link>
        </div>
      </div>
    </header>
  );
}
