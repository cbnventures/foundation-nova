import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import { HomepageFeatures } from '@/components/homepage-features';
import { HomepageHeader } from '@/components/homepage-header';

/**
 * Homepage.
 *
 * @constructor
 *
 * @since 1.0.0
 */
export default function Homepage() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout title="Homepage" description={siteConfig.tagline}>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
