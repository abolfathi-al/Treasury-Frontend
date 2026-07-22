import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { APP_BRAND } from '@core/config/brand.config';
import { WINDOW } from '@core/tokens';

export interface OrganizationSchema {
  '@context': string;
  '@type': string;
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
  telephone?: string;
  email?: string;
  address?: {
    '@type': string;
    streetAddress?: string;
    addressLocality?: string;
    addressCountry?: string;
  };
  sameAs?: string[];
}

export interface BreadcrumbSchema {
  '@context': string;
  '@type': string;
  itemListElement: Array<{
    '@type': string;
    position: number;
    name: string;
    item?: string;
  }>;
}

export interface WebPageSchema {
  '@context': string;
  '@type': string;
  name?: string;
  description?: string;
  url?: string;
  isPartOf?: {
    '@type': string;
    name?: string;
    url?: string;
  };
}

type StructuredDataSchema =
  | OrganizationSchema
  | BreadcrumbSchema
  | WebPageSchema
  | Record<string, unknown>;

@Injectable({
  providedIn: 'root',
})
export class SEOService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);
  private readonly window = inject(WINDOW);
  private readonly document = inject(DOCUMENT);

  setPageTitle(title: string): void {
    this.title.setTitle(title);
  }

  setMetaDescription(description: string): void {
    this.updateMetaTag('description', description);
  }

  setMetaKeywords(keywords: string): void {
    this.updateMetaTag('keywords', keywords);
  }

  setCanonicalUrl(url: string): void {
    let element = this.document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]'
    );
    if (!element) {
      element = this.document.createElement('link');
      element.setAttribute('rel', 'canonical');
      this.document.head.appendChild(element);
    }
    element.setAttribute('href', url);
  }

  setOpenGraphTags(tags: {
    title?: string;
    description?: string;
    type?: string;
    url?: string;
    image?: string;
    siteName?: string;
    locale?: string;
  }): void {
    const ogTags: Record<string, string> = {
      'og:title': tags.title ?? '',
      'og:description': tags.description ?? '',
      'og:type': tags.type ?? '',
      'og:url': tags.url ?? '',
      'og:image': tags.image ?? '',
      'og:site_name': tags.siteName ?? '',
      'og:locale': tags.locale ?? '',
    };

    Object.entries(ogTags).forEach(([key, value]) => {
      if (value) {
        this.updateMetaTag(key, value, true);
      }
    });
  }

  setTwitterCardTags(tags: {
    card?: string;
    title?: string;
    description?: string;
    image?: string;
  }): void {
    const twitterTags: Record<string, string> = {
      'twitter:card': tags.card ?? '',
      'twitter:title': tags.title ?? '',
      'twitter:description': tags.description ?? '',
      'twitter:image': tags.image ?? '',
    };

    Object.entries(twitterTags).forEach(([key, value]) => {
      if (value) {
        this.updateMetaTag(key, value, true);
      }
    });
  }

  generateStructuredData(
    data: StructuredDataSchema,
    id: string = 'structured-data'
  ): void {
    const existingScript = this.document.getElementById(id);
    if (existingScript) {
      existingScript.remove();
    }

    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.textContent = JSON.stringify(data);
    this.document.head.appendChild(script);
  }

  setOrganizationSchema(info: {
    companyName: string;
    logoUrl: string;
    companyDescription: string;
    phone: string;
    email?: string;
    address: string;
    socialMediaLinks?: Array<{ url: string }>;
  }): void {
    const schema: OrganizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: info.companyName,
      url: this.window.location.origin,
      logo: `${this.window.location.origin}/${info.logoUrl}`,
      description: info.companyDescription,
      telephone: info.phone,
      email: info.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: info.address,
        addressLocality: 'Tehran',
        addressCountry: 'IR',
      },
      sameAs: info.socialMediaLinks?.map((link) => link.url) ?? [],
    };

    this.generateStructuredData(schema, 'organization-schema');
  }

  setBreadcrumbSchema(items: Array<{ name: string; url?: string }>): void {
    const schema: BreadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    };

    this.generateStructuredData(schema, 'breadcrumb-schema');
  }

  setWebPageSchema(info: {
    name: string;
    description: string;
    url: string;
    siteName?: string;
    siteUrl?: string;
  }): void {
    const schema: WebPageSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: info.name,
      description: info.description,
      url: info.url,
      isPartOf: info.siteName
        ? {
            '@type': 'WebSite',
            name: info.siteName,
            url: info.siteUrl ?? this.window.location.origin,
          }
        : undefined,
    };

    this.generateStructuredData(schema, 'webpage-schema');
  }

  removeStructuredData(id: string): void {
    const existingScript = this.document.getElementById(id);
    if (existingScript) {
      existingScript.remove();
    }
  }

  resetSEO(): void {
    this.setPageTitle(APP_BRAND.defaultTitle);
    this.setMetaDescription(APP_BRAND.metaDescription);
    this.setMetaKeywords(APP_BRAND.metaKeywords);
    this.setCanonicalUrl(this.window.location.href);
  }

  private updateMetaTag(
    name: string,
    content: string,
    isProperty: boolean = false
  ): void {
    const attribute = isProperty ? 'property' : 'name';
    const selector = `${attribute}="${name}"`;

    if (this.meta.getTag(selector)) {
      this.meta.updateTag({ [attribute]: name, content });
    } else {
      this.meta.addTag({ [attribute]: name, content });
    }
  }
}
