import { Icon } from '@iconify/react';
import Heading from '@theme/Heading';

import { styles } from '@/styles/components/homepage-features';
import type { FeatureItems } from '@/types/index.d.ts';

/**
 * Homepage features.
 *
 * @constructor
 *
 * @since 1.0.0
 */
export function HomepageFeatures() {
  /**
   * Homepage features - Items.
   *
   * @since 1.0.0
   */
  const items: FeatureItems = [
    {
      id: 'dev-config',
      title: 'Unified Developer Config',
      icon: 'noto:gear',
      description: (
        <>
          Includes preferred
          {' '}
          <code>eslint</code>
          {' '}
          and
          {' '}
          <code>tsconfig</code>
          {' '}
          settings
          {' '}
          so every project starts with the same reliable base.
        </>
      ),
    },
    {
      id: 'sync-scripts',
      title: 'Automated Sync Scripts',
      icon: 'noto:repeat-button',
      description: (
        <>
          Provides reusable
          {' '}
          <code>npm</code>
          {' '}
          scripts that keep project structure, tooling, and dependencies in sync without manual micromanagement.
        </>
      ),
    },
    {
      id: 'starter-templates',
      title: 'Ready-to-Use Templates',
      icon: 'noto:page-facing-up',
      description: (
        <>
          Offers scripts and template files that speed up project setup and ensure consistency across development environments.
        </>
      ),
    },
  ];

  return (
    <section style={styles['features']}>
      <div className="container">
        <div className="row">
          {
            items.map((featureItem) => (
              <div key={featureItem.id} className="col col--4">
                <div className="text--center padding-bottom--md">
                  <Icon icon={featureItem.icon} width="175" height="175" />
                </div>
                <div className="text--center padding-horiz--md">
                  <Heading as="h3">
                    {featureItem.title}
                  </Heading>
                  <p>
                    {featureItem.description}
                  </p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </section>
  );
}
