import { ILayout } from './config';

export const DarkHeaderConfig: ILayout = {
  main: {
    componentName: 'main',
    type: 'default',
    pageBgWhite: false,
  },
  app: {
    general: {
      componentName: 'general',
      evolution: true,
      layoutType: 'default',
      mode: 'light',
      rtl: false,
      primaryColor: '#50CD89',
      pageBgWhite: false,
      pageWidth: 'default',
    },
    header: {
      componentName: 'header',
      display: true,
      default: {
        container: 'fluid',
        containerClass: 'd-flex align-items-stretch justify-content-between',
        fixed: {
          desktop: true,
          mobile: true,
        },
        sticky: {
          enabled: true,
          attributes: {
            'data-velora-sticky': 'true',
            'data-velora-sticky-name': 'app-header',
          },
        },
        content: 'menu',
        menu: {
          display: true,
          iconType: 'svg',
        },
        search: {
          display: true,
        },
        quickPanel: {
          display: true,
        },
        quickActions: {
          display: true,
        },
        notifications: {
          display: false,
        },
        chat: {
          display: false,
        },
        themMode: {
          display: true,
        },
        user: {
          display: true,
        },
      },
    },
    sidebar: {
      componentName: 'sidebar',
      display: false,
      default: {
        class: 'flex-column',
        push: {
          header: true,
          toolbar: true,
          footer: true,
        },
        drawer: {
          enabled: true,
          attributes: {
            'data-velora-drawer': 'true',
            'data-velora-drawer-name': 'app-sidebar',
            'data-velora-drawer-activate': '{default: true, lg: false}',
            'data-velora-drawer-overlay': 'true',
            'data-velora-drawer-width': '225px',
            'data-velora-drawer-direction': 'start',
            'data-velora-drawer-toggle': '#velora_app_sidebar_mobile_toggle',
          },
        },
        fixed: {
          desktop: true,
        },
        minimize: {
          desktop: {
            enabled: true,
            default: true,
            hoverable: true,
          },
        },
        menu: {
          iconType: 'svg',
        },
      },
    },
    toolbar: {
      componentName: 'toolbar',
      display: true,
      layout: 'classic',
      class: 'py-3 py-lg-6',
      container: 'fluid',
      containerClass: 'd-flex flex-stack',
      fixed: {
        desktop: false,
        mobile: false,
      },
      filterButton: true,
      daterangepickerButton: false,
      primaryButton: true,
      primaryButtonLabel: 'Create',
      primaryButtonModal: 'create-app',
    },
    pageTitle: {
      componentName: 'page-title',
      display: true,
      breadCrumb: true,
      description: false,
      direction: 'column',
    },
    content: {
      componentName: 'content',
      container: 'fluid',
    },
    footer: {
      componentName: 'footer',
      display: true,
      container: 'fluid',
      containerClass:
        'd-flex flex-column flex-md-row flex-center flex-md-stack py-3',
      fixed: {
        desktop: false,
        mobile: false,
      },
    },
    pageLoader: {
      componentName: 'page-loader',
      type: 'none',
      logoImage: 'default.svg',
      logoClass: 'mh-75px',
    },
  },
  illustrations: {
    componentName: 'illustrations',
    set: 'sketchy-1',
  },
  scrolltop: {
    componentName: 'scrolltop',
    display: true,
  },
  engage: {
    componentName: 'engage',
    demos: {
      enabled: true,
    },
    purchase: {
      enabled: false,
    },
  },
};


