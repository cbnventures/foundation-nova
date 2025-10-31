import { promises as fs } from 'fs';
import * as path from 'path';

import { itemAllowedPoliciesByRole } from '@/lib/item.js';
import { PATTERN_EMAIL_SIMPLE, PATTERN_SLUG_SCOPED, PATTERN_SLUG_SIMPLE } from '@/lib/regex.js';
import type {
  NovaConfigConfig,
  NovaConfigGetArrayOfHttpUrlsField,
  NovaConfigGetArrayOfHttpUrlsReturns,
  NovaConfigGetArrayOfHttpUrlsValue,
  NovaConfigGetArrayOfNonEmptyStringsReturns,
  NovaConfigGetArrayOfNonEmptyStringsValue,
  NovaConfigGetEmailReturns,
  NovaConfigGetEmailValue,
  NovaConfigGetHttpUrlField,
  NovaConfigGetHttpUrlReturns,
  NovaConfigGetHttpUrlValue,
  NovaConfigGetNonEmptyStringReturns,
  NovaConfigGetNonEmptyStringValue,
  NovaConfigIsEntityRoleTypeGuard,
  NovaConfigIsEntityRoleValue,
  NovaConfigIsPlainObjectTypeGuard,
  NovaConfigIsPlainObjectValue,
  NovaConfigLoadReturns,
  NovaConfigParseEntitiesParsedEntity,
  NovaConfigParseEntitiesReturns,
  NovaConfigParseEntitiesValue,
  NovaConfigParseProjectDescription,
  NovaConfigParseProjectName,
  NovaConfigParseProjectProject,
  NovaConfigParseProjectReturns,
  NovaConfigParseProjectValue,
  NovaConfigParseResult,
  NovaConfigParseReturns,
  NovaConfigParseUrlsReturns,
  NovaConfigParseUrlsUrls,
  NovaConfigParseUrlsValue,
  NovaConfigParseValue,
  NovaConfigParseWorkspacesAllowedRoles,
  NovaConfigParseWorkspacesIsNameAllowedName,
  NovaConfigParseWorkspacesIsNameAllowedReturns,
  NovaConfigParseWorkspacesIsNameAllowedRole,
  NovaConfigParseWorkspacesReturns,
  NovaConfigParseWorkspacesSlug,
  NovaConfigParseWorkspacesValue,
  NovaConfigParseWorkspacesWorkspaces,
  NovaConfigSaveReturns,
  NovaConfigSetReturns,
  NovaConfigSetValue,
} from '@/types/lib/nova-config.d.ts';

/**
 * Nova Config.
 *
 * @since 1.0.0
 */
export class NovaConfig {
  /**
   * Nova Config - Config.
   *
   * @private
   *
   * @since 1.0.0
   */
  #config: NovaConfigConfig;

  /**
   * Nova Config - Constructor.
   *
   * @since 1.0.0
   */
  public constructor() {
    this.#config = {};
  }

  /**
   * Nova Config - Load.
   *
   * @returns {NovaConfigLoadReturns}
   *
   * @since 1.0.0
   */
  public async load(): NovaConfigLoadReturns {
    const currentDirectory = process.cwd();
    const configFileName = 'nova.config.json';
    const configPath = path.join(currentDirectory, configFileName);

    try {
      const rawFile = await fs.readFile(configPath, 'utf-8');
      const parsedFile = JSON.parse(rawFile);

      // Salvage-first method.
      this.#config = this.parse(parsedFile);
    } catch {
      /* empty */
    }

    return this.#config;
  }

  /**
   * Nova Config - Set.
   *
   * @param {NovaConfigSetValue} config - Config.
   *
   * @returns {NovaConfigSetReturns}
   *
   * @since 1.0.0
   */
  public set(config: NovaConfigSetValue): NovaConfigSetReturns {
    this.#config = this.parse(config);
  }

  /**
   * Nova Config - Save.
   *
   * @returns {NovaConfigSaveReturns}
   *
   * @since 1.0.0
   */
  public async save(): NovaConfigSaveReturns {
    this.#config = this.parse(this.#config);

    const currentDirectory = process.cwd();
    const configPath = path.join(currentDirectory, 'nova.config.json');
    const serializedConfig = `${JSON.stringify(this.#config, null, 2)}\n`;
    const normalizedConfig = JSON.stringify(this.#config);

    let hasExistingFile = false;
    let existingNormalized = '';

    try {
      const existingRaw = await fs.readFile(configPath, 'utf-8');

      hasExistingFile = true;

      try {
        const existingParsed = JSON.parse(existingRaw);

        existingNormalized = JSON.stringify(this.parse(existingParsed));
      } catch {
        /* empty */
      }
    } catch {
      /* empty */
    }

    // No changes detected, skip touching the filesystem.
    if (existingNormalized === normalizedConfig) {
      return;
    }

    // Move existing file to "nova.config.YYYY-MM-DD_0001.json".
    if (hasExistingFile) {
      const now = new Date();
      const timestamp = [
        now.getUTCFullYear(),
        (now.getUTCMonth() + 1).toString().padStart(2, '0'),
        now.getUTCDate().toString().padStart(2, '0'),
      ].join('-');

      let suffix = 1;

      while (true) {
        const suffixLabel = suffix.toString().padStart(4, '0');
        const backupFileName = `nova.config.${timestamp}_${suffixLabel}.json`;
        const backupPath = path.join(currentDirectory, backupFileName);

        // If file is accessible, increment the suffix count.
        try {
          await fs.access(backupPath);

          suffix += 1;
        } catch {
          await fs.rename(configPath, backupPath);

          break;
        }
      }
    }

    await fs.writeFile(configPath, serializedConfig, 'utf-8');
  }

  /**
   * Nova Config - Parse.
   *
   * @param {NovaConfigParseValue} value - Value.
   *
   * @private
   *
   * @returns {NovaConfigParseReturns}
   *
   * @since 1.0.0
   */
  private parse(value: NovaConfigParseValue): NovaConfigParseReturns {
    const result: NovaConfigParseResult = {};

    if (!this.isPlainObject(value)) {
      return result;
    }

    const project = this.parseProject(value['project']);
    const entities = this.parseEntities(value['entities']);
    const urls = this.parseUrls(value['urls']);
    const workspaces = this.parseWorkspaces(value['workspaces'], project?.name?.slug);

    if (project !== undefined) {
      result.project = project;
    }

    if (entities !== undefined) {
      result.entities = entities;
    }

    if (urls !== undefined) {
      result.urls = urls;
    }

    if (workspaces !== undefined) {
      result.workspaces = workspaces;
    }

    return result;
  }

  /**
   * Nova Config - Parse project.
   *
   * @param {NovaConfigParseProjectValue} value - Value.
   *
   * @private
   *
   * @returns {NovaConfigParseProjectReturns}
   *
   * @since 1.0.0
   */
  private parseProject(value: NovaConfigParseProjectValue): NovaConfigParseProjectReturns {
    if (!this.isPlainObject(value)) {
      return undefined;
    }

    const project: NovaConfigParseProjectProject = {};

    const valueName = value['name'];
    const valueDescription = value['description'];
    const valueKeywords = this.getArrayOfNonEmptyStrings(value['keywords']);

    if (this.isPlainObject(valueName)) {
      const name: NovaConfigParseProjectName = {};

      const slug = this.getNonEmptyString(valueName['slug']);
      const title = this.getNonEmptyString(valueName['title']);

      if (slug !== undefined) {
        name.slug = slug;
      }

      if (title !== undefined) {
        name.title = title;
      }

      if (Object.keys(name).length > 0) {
        project.name = name;
      }
    }

    if (this.isPlainObject(valueDescription)) {
      const description: NovaConfigParseProjectDescription = {};

      const short = this.getNonEmptyString(valueDescription['short']);
      const long = this.getNonEmptyString(valueDescription['long']);

      if (short !== undefined) {
        description.short = short;
      }

      if (long !== undefined) {
        description.long = long;
      }

      if (Object.keys(description).length > 0) {
        project.description = description;
      }
    }

    if (valueKeywords !== undefined) {
      project.keywords = valueKeywords;
    }

    return (Object.keys(project).length > 0) ? project : undefined;
  }

  /**
   * Nova Config - Parse entities.
   *
   * @param {NovaConfigParseEntitiesValue} value - Value.
   *
   * @private
   *
   * @returns {NovaConfigParseEntitiesReturns}
   *
   * @since 1.0.0
   */
  private parseEntities(value: NovaConfigParseEntitiesValue): NovaConfigParseEntitiesReturns {
    if (!Array.isArray(value)) {
      return undefined;
    }

    const entities = value
      .filter(this.isPlainObject)
      .map((entity) => {
        const parsedEntity: NovaConfigParseEntitiesParsedEntity = {};

        const name = this.getNonEmptyString(entity['name']);
        const email = this.getEmail(entity['email']);
        const url = this.getHttpUrl(entity['url']);
        const roles = entity['roles'];

        if (name !== undefined) {
          parsedEntity.name = name;
        }

        if (email !== undefined) {
          parsedEntity.email = email;
        }

        if (url !== undefined) {
          parsedEntity.url = url;
        }

        if (Array.isArray(roles)) {
          const parsedRoles = roles.filter(this.isEntityRole);

          if (parsedRoles.length > 0) {
            parsedEntity.roles = parsedRoles;
          }
        }

        return (Object.keys(parsedEntity).length > 0) ? parsedEntity : null;
      })
      .filter((entity): entity is NovaConfigParseEntitiesParsedEntity => entity !== null);

    return (entities.length > 0) ? entities : undefined;
  }

  /**
   * Nova Config - Parse urls.
   *
   * @param {NovaConfigParseUrlsValue} value - Value.
   *
   * @private
   *
   * @returns {NovaConfigParseUrlsReturns}
   *
   * @since 1.0.0
   */
  private parseUrls(value: NovaConfigParseUrlsValue): NovaConfigParseUrlsReturns {
    if (!this.isPlainObject(value)) {
      return undefined;
    }

    const urls: NovaConfigParseUrlsUrls = {};
    const urlFields = [
      'homepage',
      'repository',
      'bugs',
      'license',
      'logo',
      'documentation',
      'github',
      'npm',
    ] as const;

    for (const urlField of urlFields) {
      const parsedUrl = this.getHttpUrl(value[urlField], urlField);

      if (parsedUrl !== undefined) {
        urls[urlField] = parsedUrl;
      }
    }

    const fundSources = this.getArrayOfHttpUrls(value['fundSources']);

    if (fundSources !== undefined) {
      urls.fundSources = fundSources;
    }

    return (Object.keys(urls).length > 0) ? urls : undefined;
  }

  /**
   * Nova Config - Parse workspaces.
   *
   * @param {NovaConfigParseWorkspacesValue} value - Value.
   * @param {NovaConfigParseWorkspacesSlug}  slug  - Slug.
   *
   * @private
   *
   * @returns {NovaConfigParseWorkspacesReturns}
   *
   * @since 1.0.0
   */
  private parseWorkspaces(value: NovaConfigParseWorkspacesValue, slug: NovaConfigParseWorkspacesSlug): NovaConfigParseWorkspacesReturns {
    if (!this.isPlainObject(value)) {
      return undefined;
    }

    const workspaces: NovaConfigParseWorkspacesWorkspaces = {};
    const allowedRoles: NovaConfigParseWorkspacesAllowedRoles = ['project', 'docs', 'config', 'app', 'package', 'tool'];
    const configSlug = this.getNonEmptyString(slug);

    /**
     * Nova Config - Parse workspaces - Is name allowed.
     *
     * @param {NovaConfigParseWorkspacesIsNameAllowedRole} role - Role.
     * @param {NovaConfigParseWorkspacesIsNameAllowedName} name - Name.
     *
     * @returns {NovaConfigParseWorkspacesIsNameAllowedReturns}
     *
     * @since 1.0.0
     */
    const isNameAllowed = (role: NovaConfigParseWorkspacesIsNameAllowedRole, name: NovaConfigParseWorkspacesIsNameAllowedName): NovaConfigParseWorkspacesIsNameAllowedReturns => {
      switch (role) {
        case 'project':
          if (configSlug !== undefined) {
            return name === `${configSlug}-project`;
          }

          return name === 'project';
        case 'docs':
          if (configSlug !== undefined) {
            return name === `${configSlug}-docs`;
          }

          return name === 'docs';
        case 'tool':
        case 'config':
        case 'app':
          const base = (configSlug !== undefined) ? `${configSlug}-${role}` : role;

          if (!name.startsWith(`${base}-`)) {
            return false;
          }

          const descriptor = name.slice(base.length + 1);

          return descriptor.length > 0 && PATTERN_SLUG_SIMPLE.test(descriptor);
        case 'package':
          return PATTERN_SLUG_SIMPLE.test(name) || PATTERN_SLUG_SCOPED.test(name);
        default:
          return false;
      }
    };

    for (const [path, options] of Object.entries(value)) {
      if (!this.isPlainObject(options)) {
        continue;
      }

      const nameCandidate = this.getNonEmptyString(options['name']);
      const roleCandidate = this.getNonEmptyString(options['role']);
      const policyCandidate = this.getNonEmptyString(options['policy']);

      if (nameCandidate === undefined) {
        continue;
      }

      const role = allowedRoles.find((allowedRole) => allowedRole === roleCandidate);

      if (role === undefined) {
        continue;
      }

      const allowedPolicies = itemAllowedPoliciesByRole[role];
      const policy = allowedPolicies.find((allowedPolicy) => allowedPolicy === policyCandidate);

      if (policy === undefined) {
        continue;
      }

      if (!isNameAllowed(role, nameCandidate)) {
        continue;
      }

      workspaces[path] = {
        name: nameCandidate,
        role,
        policy,
      };
    }

    return (Object.keys(workspaces).length > 0) ? workspaces : undefined;
  }

  /**
   * Nova Config - Is entity role.
   *
   * @param {NovaConfigIsEntityRoleValue} value - Value.
   *
   * @private
   *
   * @returns {boolean}
   *
   * @since 1.0.0
   */
  private isEntityRole(value: NovaConfigIsEntityRoleValue): value is NovaConfigIsEntityRoleTypeGuard {
    return (
      value === 'author'
      || value === 'contributor'
      || value === 'supporter'
    );
  }

  /**
   * Nova Config - Is plain object.
   *
   * @param {NovaConfigIsPlainObjectValue} value - Value.
   *
   * @private
   *
   * @returns {boolean}
   *
   * @since 1.0.0
   */
  private isPlainObject(value: NovaConfigIsPlainObjectValue): value is NovaConfigIsPlainObjectTypeGuard {
    if (typeof value !== 'object' || value === null) {
      return false;
    }

    if (Array.isArray(value)) {
      return false;
    }

    const prototype = Object.getPrototypeOf(value);

    // Treat both ordinary object literals and prototype-less dictionaries (Object.create(null)) as "plain".
    return prototype === Object.prototype || prototype === null;
  }

  /**
   * Nova Config - Get array of non-empty strings.
   *
   * @param {NovaConfigGetArrayOfNonEmptyStringsValue} value - Value.
   *
   * @private
   *
   * @returns {NovaConfigGetArrayOfNonEmptyStringsReturns}
   *
   * @since 1.0.0
   */
  private getArrayOfNonEmptyStrings(value: NovaConfigGetArrayOfNonEmptyStringsValue): NovaConfigGetArrayOfNonEmptyStringsReturns {
    if (!Array.isArray(value)) {
      return undefined;
    }

    const items = value
      .map((item) => this.getNonEmptyString(item))
      .filter((item): item is string => item !== undefined);

    return (items.length > 0) ? items : undefined;
  }

  /**
   * Nova Config - Get array of http urls.
   *
   * @param {NovaConfigGetArrayOfHttpUrlsValue} value   - Value.
   * @param {NovaConfigGetArrayOfHttpUrlsField} [field] - Field.
   *
   * @private
   *
   * @returns {NovaConfigGetArrayOfHttpUrlsReturns}
   *
   * @since 1.0.0
   */
  private getArrayOfHttpUrls(value: NovaConfigGetArrayOfHttpUrlsValue, field?: NovaConfigGetArrayOfHttpUrlsField): NovaConfigGetArrayOfHttpUrlsReturns {
    if (!Array.isArray(value)) {
      return undefined;
    }

    const items = value
      .map((item) => this.getHttpUrl(item, field))
      .filter((item): item is string => item !== undefined);

    return (items.length > 0) ? items : undefined;
  }

  /**
   * Nova Config - Get email.
   *
   * @param {NovaConfigGetEmailValue} value - Value.
   *
   * @private
   *
   * @returns {NovaConfigGetEmailReturns}
   *
   * @since 1.0.0
   */
  private getEmail(value: NovaConfigGetEmailValue): NovaConfigGetEmailReturns {
    const email = this.getNonEmptyString(value);

    if (email === undefined) {
      return undefined;
    }

    if (!PATTERN_EMAIL_SIMPLE.test(email)) {
      return undefined;
    }

    return email;
  }

  /**
   * Nova Config - Get http url.
   *
   * @param {NovaConfigGetHttpUrlValue} value   - Value.
   * @param {NovaConfigGetHttpUrlField} [field] - Field.
   *
   * @private
   *
   * @returns {NovaConfigGetHttpUrlReturns}
   *
   * @since 1.0.0
   */
  private getHttpUrl(value: NovaConfigGetHttpUrlValue, field?: NovaConfigGetHttpUrlField): NovaConfigGetHttpUrlReturns {
    const candidateUrl = this.getNonEmptyString(value);

    if (candidateUrl === undefined) {
      return undefined;
    }

    try {
      const url = new URL(candidateUrl);

      const genericProtocols = ['http:', 'https:'];
      const repositoryProtocols = ['git:', 'git+https:', 'git+ssh:', 'git+http:', 'https:', 'http:'];
      const allowedProtocols = (field === 'repository') ? repositoryProtocols : genericProtocols;

      return allowedProtocols.includes(url.protocol) ? candidateUrl : undefined;
    } catch {
      return undefined;
    }
  }

  /**
   * Nova Config - Get non-empty string.
   *
   * @param {NovaConfigGetNonEmptyStringValue} value - Value.
   *
   * @private
   *
   * @returns {NovaConfigGetNonEmptyStringReturns}
   *
   * @since 1.0.0
   */
  private getNonEmptyString(value: NovaConfigGetNonEmptyStringValue): NovaConfigGetNonEmptyStringReturns {
    if (typeof value !== 'string') {
      return undefined;
    }

    const string = value.trim();

    return (string.length > 0) ? string : undefined;
  }
}
