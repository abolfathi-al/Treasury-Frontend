# Graph Report - .  (2026-07-22)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 4157 nodes · 9206 edges · 211 communities (155 shown, 56 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 368 edges (avg confidence: 0.79)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9f49c395`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- PageInfoService
- StickyDirective
- DropzoneDirective
- DrawerDirective
- ThemeModeValue
- TranslationService
- SearchDirective
- AutocompleteDirective
- .error
- locales/en.ts
- locales/fa.ts
- velora-icon.component.ts
- format-date.ts
- menu.directive.ts
- MaxlengthDirective
- TinySliderDirective
- CookieAlertDirective
- StepperDirective
- MenuDirective
- navbar.component.ts
- ModalConfig
- setOptionIfChanged
- TagifyDirective
- base-error.component.ts
- directive-helpers.ts
- LoggerService
- runSafely
- layout.service.ts
- ScrollDirective
- tokens/index.ts
- InputmaskDirective
- directive-host.ts
- StandardFormControl
- HierarchyGraphComponent
- FullCalendarDirective
- TreeDirective
- shell.facade.ts
- ErrorUtils
- ClipboardDirective
- FlatpickrDirective
- NoUiSliderDirective
- .warn
- Application Toolbar
- DraggableDirective
- logger.service.ts
- DemoContextStore
- d3/index.ts
- BaseDirective
- AutosizeDirective
- ImageInputDirective
- ScrollTopDirective
- standard-control-base.ts
- css.token.ts
- CountUpDirective
- ToggleDirective
- layout.component.ts
- AnimationUtil
- ContextSwitchResult
- AuthService
- HierarchyTreeComponent
- D3WaterfallChartDirective
- SwapperDirective
- header.component.ts
- Enterprise Dashboard Master
- services/index.ts
- ILayout
- PermissionService
- hierarchy-graph.component.ts
- LayoutService
- PasswordMeterDirective
- NamedFormControl
- legacy-storage-cleanup.initializer.ts
- interceptors/index.ts
- context.models.ts
- .key
- ErrorService
- DialerDirective
- navbar.component.spec.ts
- CssLoaderService
- modules/i18n/index.ts
- d3-chart.types.ts
- EventUtil
- auth.service.ts
- d3-gauge-chart.directive.ts
- standard-control-imports.ts
- app.config.spec.ts
- ProfilerService
- KeyboardEventService
- notifications-inner.component.spec.ts
- D3DonutChartDirective
- NumericFormControl
- TypedDirective
- more-filters-dropdown.component.ts
- classic.component.ts
- sidebar-menu.component.ts
- BaseErrorComponent
- tiny-slider.directive.ts
- shared-form-controls.spec.ts
- TypeScript Locale Modules
- AppComponent
- error.interceptor.ts
- NotificationService
- SEOService
- CustomTitleStrategy
- AuthComponent
- inputmask.directive.ts
- shell.facade.spec.ts
- TitleService
- d3-donut-chart.directive.ts
- D3ProgressBreakdownDirective
- AntiAutocompleteDirective
- base-directive.spec.ts
- tree.directive.ts
- InvalidFeedbackComponent
- Shared Pipes
- file-download.service.ts
- InMemoryDbService
- demo-context.store.ts
- cookie-alert.directive.ts
- UI Architecture
- async-resource.ts
- AuthFacadeState
- demo-context.providers.ts
- registration.component.ts
- SidebarComponent
- SearchResultInnerComponent
- topbar.component.spec.ts
- CookieService
- FocusManagementService
- DueInPipe
- hierarchy-tree.component.ts
- ResponsiveUtil
- Modals, Drawers, and Wizards
- basic-information.service.ts
- fullcalendar.directive.ts
- D3ForceGraphDirective
- .render
- D3TimelineDirective
- DirectiveState
- DateLikeControl
- ClassicComponent
- DeepDiffMapper
- Forms and Controls
- Velora Directives Catalog
- Velora UI Knowledge Index
- LoaderService
- LocalStoragePolyfillImpl
- app.type.ts
- D3BarChartDirective
- D3ScoreChartDirective
- .remove
- Hierarchy Graph
- Search Interface
- AuthSessionPort
- seo.service.ts
- AppInitializationService
- MemoryStorage
- MemoryStorage
- autosize.directive.ts
- User Menu
- ToolbarComponent
- Form Validation Model
- mock-api.interceptor.ts
- AuthGuard
- ForgotPasswordComponent
- RegistrationComponent
- D3ChartHostDirective
- IfIsBrowserDirective
- scroll.directive.spec.ts
- settings.model.ts
- Enterprise Dashboard
- typed.directive.ts
- Notification Logs
- Quick Links
- ErrorReporterPort
- fake.interceptor.ts
- Demo Action Modal
- More Filters Dropdown
- Donut Chart
- Gauge Chart
- Progress Breakdown
- Waterfall Chart
- Invalid Feedback
- Button with Indicator
- Row Actions Dropdown
- Hierarchy Tree
- Messenger Drawer
- Modal Template
- app-routing.ts
- Error Shell
- Paragraph Skeleton
- Hierarchy Node Card
- Full Hierarchy Path
- Loading Indicator
- resolveD3ChartTheme
- Injectable
- modular-merge.ts

## God Nodes (most connected - your core abstractions)
1. `runSafely()` - 135 edges
2. `LoggerService` - 132 edges
3. `TreeDirective` - 118 edges
4. `MenuDirective` - 117 edges
5. `BaseDirective` - 89 edges
6. `StickyDirective` - 73 edges
7. `locales/en.ts` - 67 edges
8. `locales/fa.ts` - 67 edges
9. `tokens/index.ts` - 62 edges
10. `DropzoneDirective` - 58 edges

## Surprising Connections (you probably didn't know these)
- `Logout Template` --conceptually_related_to--> `TypeScript Locale Modules`  [INFERRED]
  src/app/modules/auth/pages/logout/logout.component.html → docs/ui/i18n-and-formatting.md
- `Registration Reactive Form` --implements--> `Form Validation Model`  [INFERRED]
  src/app/modules/auth/pages/registration/registration.component.html → docs/ui/forms-and-controls.md
- `Root Router Outlet` --implements--> `Route and Layout Structure`  [INFERRED]
  src/app/app.component.html → docs/ui/ui-architecture.md
- `Authentication Shell Template` --implements--> `Route and Layout Structure`  [INFERRED]
  src/app/modules/auth/pages/auth-shell/auth.component.html → docs/ui/ui-architecture.md
- `Responsive Authentication Layout` --conceptually_related_to--> `RTL and LTR Directionality`  [INFERRED]
  src/app/modules/auth/pages/auth-shell/auth.component.html → docs/ui/i18n-and-formatting.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Dashboard Master Reuse Model** — docs_frontend_refactor_plan_enterprise_dashboard_master, docs_frontend_refactor_plan_project_composition_boundary, docs_frontend_refactor_plan_future_project_adoption_flow, docs_frontend_refactor_plan_versioned_master_release [EXTRACTED 1.00]
- **Master Product Neutrality Controls** — docs_frontend_refactor_plan_master_product_neutrality, docs_frontend_refactor_plan_configuration_driven_variation, docs_frontend_refactor_plan_legacy_identity_migration, docs_frontend_refactor_plan_allowed_dependency_direction [EXTRACTED 1.00]
- **Treasury Consumer Governance** — docs_frontend_refactor_plan_enterprise_treasury_frontend, docs_frontend_refactor_plan_enterprise_treasury_canon_authority, docs_frontend_refactor_plan_canon_implementation_gate, docs_frontend_refactor_plan_treasury_first_consumer [EXTRACTED 1.00]
- **Authentication Route Template Composition** — src_app_app_component_root_router_outlet, src_app_modules_auth_pages_auth_shell_auth_component_auth_shell_template, src_app_modules_auth_pages_login_login_component_login_template, src_app_modules_auth_pages_registration_registration_component_registration_template, src_app_modules_auth_pages_logout_logout_component_logout_template [INFERRED 0.85]
- **Shared Chart Visualizations** — src_app_shared_charts_donut_chart_donut_chart_component_donut_chart, src_app_shared_charts_gauge_chart_gauge_chart_component_gauge_chart, src_app_shared_charts_progress_breakdown_progress_breakdown_component_progress_breakdown, src_app_shared_charts_waterfall_chart_waterfall_chart_component_waterfall_chart [INFERRED 0.95]
- **Scope Hierarchy Interface** — src_app_shared_ui_hierarchy_hierarchy_graph_hierarchy_graph_component_hierarchy_graph, src_app_shared_ui_hierarchy_hierarchy_node_card_hierarchy_node_card_component_hierarchy_node_card, src_app_shared_ui_hierarchy_hierarchy_path_preview_hierarchy_path_preview_component_hierarchy_path_preview, src_app_shared_ui_hierarchy_hierarchy_tree_hierarchy_tree_component_hierarchy_tree [INFERRED 0.95]
- **Shell Navigation Utilities** — src_app_shell_components_extras_dropdown_inner_notifications_inner_notifications_inner_component_notifications_menu, src_app_shell_components_extras_dropdown_inner_quick_links_inner_quick_links_inner_component_quick_links, src_app_shell_components_extras_dropdown_inner_search_result_inner_search_result_inner_component_search_interface, src_app_shell_components_extras_dropdown_inner_user_inner_user_inner_component_user_menu [INFERRED 0.85]
- **Header Navigation Composition** — src_app_shell_layout_components_header_header_component_application_header, src_app_shell_layout_components_header_header_menu_header_menu_component_header_menu, src_app_shell_layout_components_header_navbar_navbar_component_header_navbar, src_app_shell_layout_components_header_page_title_page_title_component_page_title [EXTRACTED 1.00]
- **Toolbar Layout Variants** — src_app_shell_layout_components_toolbar_toolbar_component_application_toolbar, src_app_shell_layout_components_toolbar_classic_classic_component_classic_toolbar, src_app_shell_layout_components_toolbar_accounting_accounting_component_accounting_toolbar, src_app_shell_layout_components_toolbar_extended_extended_component_extended_toolbar, src_app_shell_layout_components_toolbar_reports_reports_component_reports_toolbar, src_app_shell_layout_components_toolbar_saas_saas_component_saas_toolbar [EXTRACTED 1.00]
- **Application Shell Regions** — src_app_shell_layout_layout_component_application_shell, src_app_shell_layout_components_header_header_component_application_header, src_app_shell_layout_components_sidebar_sidebar_component_application_sidebar, src_app_shell_layout_components_toolbar_toolbar_component_application_toolbar, src_app_shell_layout_components_content_content_component_routed_content, src_app_shell_layout_components_footer_footer_component_application_footer [EXTRACTED 1.00]
- **Domain UI Acceptance System** — docs_ui_domain_workspace_design_rules_workspace_acceptance_gate, docs_ui_implementation_checklist_workspace_completion_gate, docs_ui_tables_and_grids_table_acceptance_gate, docs_ui_states_loading_error_empty_partial_validation_states, docs_ui_actions_permissions_disabled_vs_hidden [EXTRACTED 1.00]
- **Resilient Error Experience** — docs_ui_states_loading_error_empty_error_states, docs_ui_states_loading_error_empty_loading_states, docs_ui_states_loading_error_empty_partial_validation_states, src_app_modules_errors_pages_error404_error404_component_error404_template, src_app_modules_errors_pages_error500_error500_component_error500_template [INFERRED 0.95]

## Communities (211 total, 56 thin omitted)

### Community 0 - "PageInfoService"
Cohesion: 0.05
Nodes (29): navigation/index.ts, PageNavigationActiveMatch, PageNavigationItem, PageNavigationItemKind, PAGE_NAVIGATION_ITEMS, isPageNavigationItemActive(), isPageNavigationItemCurrentPage(), normalizePageNavigationUrl() (+21 more)

### Community 2 - "DropzoneDirective"
Cohesion: 0.05
Nodes (12): DropzoneDirective, DropzoneError, DropzoneOptions, hasDropzoneRemoveHandler(), markDropzoneRemoveHandler(), AssertAll, DropzonePublicTypeContracts, IsAny (+4 more)

### Community 3 - "DrawerDirective"
Cohesion: 0.07
Nodes (6): DrawerDirective, DrawerStore, HostComponent, setup(), Component, Directive

### Community 4 - "ThemeModeValue"
Cohesion: 0.07
Nodes (25): resolveInitializerMode(), themeModeSetup(), ThemeModeDomService, Injectable, isThemeModeValue(), THEME_MODE_ATTRIBUTES, THEME_MODE_DEFAULTS, THEME_MODE_IMAGE_ATTRIBUTES (+17 more)

### Community 5 - "TranslationService"
Cohesion: 0.05
Nodes (27): core/i18n/index.ts, LANGUAGE_SERVICE, LanguageDirection, LanguageServicePort, Locale, TranslationData, TranslationDataValue, addThemeLink() (+19 more)

### Community 6 - "SearchDirective"
Cohesion: 0.07
Nodes (6): SearchResultItem, SearchDirective, HostComponent, setup(), Component, Directive

### Community 7 - "AutocompleteDirective"
Cohesion: 0.08
Nodes (5): AutocompleteDirective, Directive, CHECK_DELAYS_MS, SingleOptionDirective, Directive

### Community 8 - ".error"
Cohesion: 0.07
Nodes (3): CoreUtil, isRecord(), DomUtil

### Community 9 - "locales/en.ts"
Cohesion: 0.05
Nodes (57): access/en.ts, accessDomainEn, audit/en.ts, auditDomainEn, identity/en.ts, identityDomainEn, organization/en.ts, organizationDomainEn (+49 more)

### Community 10 - "locales/fa.ts"
Cohesion: 0.05
Nodes (57): access/fa.ts, accessDomainFa, audit/fa.ts, auditDomainFa, identity/fa.ts, identityDomainFa, organization/fa.ts, organizationDomainFa (+49 more)

### Community 11 - "velora-icon.component.ts"
Cohesion: 0.05
Nodes (41): DashboardComponent, DashboardMetric, FoundationArea, Component, isVeloraIconType(), Component, VELORA_ICON_CONSTANTS, VeloraIconComponent (+33 more)

### Community 12 - "format-date.ts"
Cohesion: 0.07
Nodes (41): flatpickrConfig, parseDate(), TIME_COMPONENTS, ExtendDatePipe, Pipe, pipes/index.ts, LocaleNumberPipe, toEnglish() (+33 more)

### Community 13 - "menu.directive.ts"
Cohesion: 0.07
Nodes (22): DEFAULT_OPTIONS, DrawerOptions, DrawerStateChangeEvent, CSS, DEFAULT_OPTIONS, MenuDirectiveWindow, MenuItemConfig, MenuOptions (+14 more)

### Community 17 - "StepperDirective"
Cohesion: 0.09
Nodes (4): LoginComponent, Component, StepperDirective, Directive

### Community 19 - "navbar.component.ts"
Cohesion: 0.09
Nodes (24): AUTH_SESSION, AuthenticatedRequestUser, AuthUserSnapshot, core/auth/index.ts, getUserByToken(), AUTH_PATHS, authInterceptor(), refreshTokenSubject (+16 more)

### Community 20 - "ModalConfig"
Cohesion: 0.05
Nodes (17): CoercionBackingStore, ConditionalCall(), ConditionalMethod, ConditionalHost, addCancelMethod(), Debounce(), DebouncedSourceMethod, hasSameArgs() (+9 more)

### Community 21 - "setOptionIfChanged"
Cohesion: 0.06
Nodes (27): DEFAULT_OPTIONS, FlatpickrError, FlatpickrFactory, FlatpickrInstance, FlatpickrNativeOptions, FlatpickrOptions, FlatpickrValidationResult, GlobalFlatpickrRegistry (+19 more)

### Community 23 - "base-error.component.ts"
Cohesion: 0.10
Nodes (18): ErrorRouteData, components/index.ts, errors/data-access/index.ts, ErrorsRouting, modules/errors/index.ts, ERROR_CODES, ErrorConfig, ErrorInfo (+10 more)

### Community 24 - "directive-helpers.ts"
Cohesion: 0.07
Nodes (27): ClipboardError, ClipboardFactory, ClipboardOptions, ClipboardValidationResult, DEFAULT_OPTIONS, CountUpCtor, CountUpError, CountUpOptions (+19 more)

### Community 25 - "LoggerService"
Cohesion: 0.09
Nodes (8): setupUnrecoverableHandling(), setupUpdateChecking(), setupVersionActivation(), ApplicationRefStub, SwUpdateStub, swCheckForUpdate(), LoggerService, Injectable

### Community 26 - "runSafely"
Cohesion: 0.12
Nodes (5): createSafeExecutor(), invokeCallbackSafely(), LoggerAdapter, runSafely(), emitSafely()

### Community 27 - "layout.service.ts"
Cohesion: 0.09
Nodes (30): CSSClassesType, HTMLAttributesType, IApp, IContent, IEngage, IFooter, IGeneral, IHeader (+22 more)

### Community 28 - "ScrollDirective"
Cohesion: 0.12
Nodes (3): ScrollDirective, ScrollResponsiveValue, Directive

### Community 29 - "tokens/index.ts"
Cohesion: 0.10
Nodes (17): backForwardCacheSetup(), initializers/index.ts, ANIMATION_FRAME, CACHES, CRYPTO, HISTORY, tokens/index.ts, LOCAL_STORAGE (+9 more)

### Community 31 - "directive-host.ts"
Cohesion: 0.07
Nodes (24): ATTRIBUTES, AutocompleteMode, CONSTANTS, DEFAULT_OPTIONS, DialerChangeEvent, DialerOptions, DEFAULT_CONFIG, DragEvent (+16 more)

### Community 33 - "HierarchyGraphComponent"
Cohesion: 0.12
Nodes (3): HierarchyGraphComponent, Component, ViewChild

### Community 36 - "shell.facade.ts"
Cohesion: 0.09
Nodes (11): SIDEBAR_FOOTER_CONSTANTS, SidebarFooterComponent, Component, SIDEBAR_LOGO_CONSTANTS, SidebarLogoComponent, Component, CONTAINER_CLASSES, isLayoutType() (+3 more)

### Community 37 - "ErrorUtils"
Cohesion: 0.16
Nodes (8): ErrorUtils, isRecord(), readErrorCode(), readErrorPayload(), readRecord(), readStatus(), readString(), UnknownRecord

### Community 39 - "FlatpickrDirective"
Cohesion: 0.11
Nodes (3): FlatpickrDirective, registerGlobalFlatpickr(), Directive

### Community 41 - ".warn"
Cohesion: 0.16
Nodes (3): LayoutComponent, Component, StyleUtil

### Community 42 - "Application Toolbar"
Cohesion: 0.07
Nodes (31): Theme Mode Switcher, Light, Dark, and System Theme Modes, Routed Content Region, Router Outlet, Application Footer, Application Header, Sidebar Toggle, Dashboard Route (+23 more)

### Community 44 - "logger.service.ts"
Cohesion: 0.08
Nodes (23): DEFAULT_CONFIG, LOG_LEVEL_NAMES, LogConfig, LogEntry, LOGGER_CONSTANTS, LogLevel, SanitizedLogEntry, DEFAULT_OPTIONS (+15 more)

### Community 45 - "DemoContextStore"
Cohesion: 0.16
Nodes (5): ActorMembership, DEMO_ACTOR_MEMBERSHIPS, DEMO_ORGANIZATION_MEMBERSHIPS, DemoContextStore, Injectable

### Community 46 - "d3/index.ts"
Cohesion: 0.30
Nodes (15): applySvgAccessibility(), renderEmptyState(), compactD3ChartLabel(), formatD3ChartValue(), chartSize(), DEFAULT_D3_CHART_MARGIN, mergedMargin(), normalizePercent() (+7 more)

### Community 47 - "BaseDirective"
Cohesion: 0.08
Nodes (9): AutocompleteConfig, AutocompleteCustomEvent, AutocompleteDataSource, AutocompleteError, AutocompleteItem, DEFAULT_OPTIONS, EVENTS, BaseDirective (+1 more)

### Community 49 - "ImageInputDirective"
Cohesion: 0.16
Nodes (3): ImageInputDirective, ImageInputStore, Directive

### Community 50 - "ScrollTopDirective"
Cohesion: 0.14
Nodes (6): ScrollTopDirective, BlankRouteComponent, HostComponent, setup(), Component, Directive

### Community 51 - "standard-control-base.ts"
Cohesion: 0.13
Nodes (14): AsyncSelectControlComponent, Component, MembershipSelectorControlComponent, Component, MultiSelectControlComponent, Component, OrganizationSelectorControlComponent, Component (+6 more)

### Community 52 - "css.token.ts"
Cohesion: 0.09
Nodes (18): StandardSpeechRecognition, WebkitSpeechRecognition, CSS, CssApi, fallbackCssApi, resolveCssApi(), WindowWithCssApi, MEDIA_DEVICES (+10 more)

### Community 54 - "ToggleDirective"
Cohesion: 0.14
Nodes (5): HostComponent, setup(), Component, ToggleDirective, Directive

### Community 55 - "layout.component.ts"
Cohesion: 0.15
Nodes (9): MessengerDrawerComponent, Component, ContentComponent, RouterStub, Component, FooterComponent, Component, LAYOUT_CONSTANTS (+1 more)

### Community 56 - "AnimationUtil"
Cohesion: 0.11
Nodes (5): SplashScreenComponent, Component, SplashScreenService, Injectable, AnimationUtil

### Community 57 - "ContextSwitchResult"
Cohesion: 0.16
Nodes (10): ActiveAccessContextFacade, ActorContextFacade, ActiveAccessContext, ActorContext, ContextSwitchRequest, ContextSwitchResult, DemoActiveAccessContextFacade, Injectable (+2 more)

### Community 58 - "AuthService"
Cohesion: 0.14
Nodes (3): AuthModel, AuthService, Injectable

### Community 59 - "HierarchyTreeComponent"
Cohesion: 0.14
Nodes (3): HierarchyTreeComponent, Component, ViewChild

### Community 60 - "D3WaterfallChartDirective"
Cohesion: 0.13
Nodes (13): ChartTone, getElementDirection(), WaterfallChartItem, D3WaterfallChartDirective, Directive, Input, WaterfallBar, Component (+5 more)

### Community 62 - "header.component.ts"
Cohesion: 0.13
Nodes (17): HeaderComponent, DrawerDirectiveStub, HeaderMenuStubComponent, MenuDirectiveStub, NavbarStubComponent, PageTitleStubComponent, SwapperDirectiveStub, ToggleDirectiveStub (+9 more)

### Community 63 - "Enterprise Dashboard Master"
Cohesion: 0.10
Nodes (24): Allowed Dependency Direction, Canon Implementation Gate, Clean Room Consumer Check, Configuration Driven Variation, Enterprise Dashboard Master, Enterprise Treasury Canon Authority, Enterprise Treasury Frontend, Future Project Adoption Flow (+16 more)

### Community 64 - "services/index.ts"
Cohesion: 0.15
Nodes (9): AppInitializationConfig, TranslateServiceStub, GlobalEventsService, KEY, Injectable, FocusManagementConfig, services/index.ts, KeyboardEventHandlers (+1 more)

### Community 65 - "ILayout"
Cohesion: 0.23
Nodes (4): ILayout, LayoutInitService, Injectable, LayoutServiceStub

### Community 67 - "hierarchy-graph.component.ts"
Cohesion: 0.13
Nodes (17): GraphLegendItem, LayoutDirection, MiniMapLink, MiniMapNode, PositionedLink, PositionedNode, HierarchyNodeCardComponent, Component (+9 more)

### Community 68 - "LayoutService"
Cohesion: 0.21
Nodes (3): LayoutType, LayoutService, Injectable

### Community 71 - "NamedFormControl"
Cohesion: 0.12
Nodes (9): BooleanControlComponent, Component, NamedFormControl, PasswordFormControl, TagsFormControl, TextualFormControl, Directive, TagsControlComponent (+1 more)

### Community 72 - "legacy-storage-cleanup.initializer.ts"
Cohesion: 0.13
Nodes (11): cleanupLegacyStorage(), LEGACY_NAMESPACE_CHAR_CODES, LEGACY_STORAGE_KEY_SUFFIXES, legacyNamespace(), legacyStorageCleanupSetup(), legacyStorageKeyPrefixes(), legacyStorageKeys(), shouldRemoveLegacyStorageKey() (+3 more)

### Community 73 - "interceptors/index.ts"
Cohesion: 0.14
Nodes (15): browserStateInterceptor(), STATE_PATHS, cache, cacheInterceptor(), convertInterceptor(), HTTPS_PATHS, httpsInterceptor(), interceptors/index.ts (+7 more)

### Community 74 - "context.models.ts"
Cohesion: 0.15
Nodes (14): ActorType, AuthFacadeStatus, ConsumerActorSubtype, ContextStatus, IdentitySummary, MembershipStatus, OrganizationContext, OrganizationMembership (+6 more)

### Community 75 - ".key"
Cohesion: 0.09
Nodes (8): syncInputsToOptions(), FieldValueChange, FormFieldState, FormUtil, FormValidationErrorMap, FormValueMap, utils/index.ts, extraLocaleFa

### Community 76 - "ErrorService"
Cohesion: 0.16
Nodes (5): ErrorService, Injectable, ErrorCode, ErrorContext, ErrorReport

### Community 78 - "navbar.component.spec.ts"
Cohesion: 0.14
Nodes (18): NavbarComponent, MenuDirectiveStub, NotificationsInnerStubComponent, QuickLinksInnerStubComponent, SearchDirectiveStub, SearchResultInnerStubComponent, ThemeModeSwitcherStubComponent, Component (+10 more)

### Community 80 - "modules/i18n/index.ts"
Cohesion: 0.10
Nodes (21): common/en.ts, commonEn, common/fa.ts, commonFa, modules/i18n/index.ts, layout/en.ts, layoutEn, layout/fa.ts (+13 more)

### Community 81 - "d3-chart.types.ts"
Cohesion: 0.14
Nodes (18): D3ChartDirectiveHostComponent, Component, D3ChartSize, ChartDirection, ChartToneInput, D3ChartConfig, D3ChartDatum, D3ChartLegend (+10 more)

### Community 84 - "auth.service.ts"
Cohesion: 0.19
Nodes (11): AuthRouting, AuthState, UserType, auth/data-access/index.ts, Permission, guards/index.ts, modules/auth/index.ts, ErrorStates (+3 more)

### Community 85 - "d3-gauge-chart.directive.ts"
Cohesion: 0.19
Nodes (10): GaugeChartSegment, getChartColorClass(), getChartTone(), getDefaultChartTone(), D3GaugeChartDirective, D3GaugeSegment, Directive, Input (+2 more)

### Community 86 - "standard-control-imports.ts"
Cohesion: 0.18
Nodes (10): directives/index.ts, form-controls/index.ts, SingleSelectControlComponent, Component, DIALER_INPUT_IMPORTS, PASSWORD_INPUT_IMPORTS, SINGLE_SELECT_IMPORTS, TAGIFY_INPUT_IMPORTS (+2 more)

### Community 87 - "app.config.spec.ts"
Cohesion: 0.18
Nodes (13): APP_CONFIG_CONSTANTS, AppProvidersConfig, buildErrorReporter(), buildInitializers(), buildInterceptors(), buildModuleProviders(), buildRouterProviders(), buildServiceWorkerProvider() (+5 more)

### Community 88 - "ProfilerService"
Cohesion: 0.17
Nodes (6): PROFILER_PATHS, profilerInterceptor(), ProfilerLog, ProfilerLogLevel, ProfilerService, Injectable

### Community 90 - "notifications-inner.component.spec.ts"
Cohesion: 0.14
Nodes (10): InlineSvgStubDirective, NgOptimizedImageStubDirective, RouterLinkStubDirective, TranslatePipeStub, TranslationServiceStub, Component, Directive, Input (+2 more)

### Community 91 - "D3DonutChartDirective"
Cohesion: 0.21
Nodes (8): DonutChartLegendSegment, DonutChartSegment, D3DonutChartDirective, D3DonutSegment, Directive, Input, DonutChartComponent, Component

### Community 92 - "NumericFormControl"
Cohesion: 0.15
Nodes (9): InputmaskOptions, CurrencyControlComponent, Component, NumberControlComponent, Component, PercentControlComponent, Component, NumericFormControl (+1 more)

### Community 94 - "more-filters-dropdown.component.ts"
Cohesion: 0.18
Nodes (11): RowActionItem, RowActionTone, WorkspaceFilterKey, dropdowns/index.ts, FILTER_CONTROLS, FilterControl, MoreFiltersDropdownComponent, Component (+3 more)

### Community 95 - "classic.component.ts"
Cohesion: 0.14
Nodes (10): CLASSIC_TOOLBAR_CONSTANTS, ClassicToolbarLayoutState, ClassicToolbarLayoutConfig, layoutConfig, LayoutServiceStub, TranslateServiceStub, resolveClassicToolbarCommands(), ShellToolbarCommand (+2 more)

### Community 96 - "sidebar-menu.component.ts"
Cohesion: 0.19
Nodes (10): Injectable, SidebarMenuComponent, MenuDirectiveStub, ScrollDirectiveStub, Component, Directive, Input, VeloraIconStubComponent (+2 more)

### Community 97 - "BaseErrorComponent"
Cohesion: 0.17
Nodes (3): BaseErrorComponent, readRouteString(), Component

### Community 98 - "tiny-slider.directive.ts"
Cohesion: 0.15
Nodes (11): DEFAULT_OPTIONS, EmptyHostComponent, HostComponent, setup(), setupEmpty(), TinySliderDirectiveInternals, Component, TinySliderError (+3 more)

### Community 99 - "shared-form-controls.spec.ts"
Cohesion: 0.15
Nodes (15): DialerControlComponent, Component, PasswordControlComponent, Component, DisabledExistingControlHostComponent, DynamicControlHostComponent, ExistingControlHostComponent, SharedFormControlsHostComponent (+7 more)

### Community 100 - "TypeScript Locale Modules"
Cohesion: 0.18
Nodes (15): Invalid Feedback Rendering, TypeScript Locale Modules, Domain-Specific Empty State Pattern, Route and Local Error States, Scoped Loading States, Partial Data and Validation States, Loading, Error, Empty, Partial, and Validation States, AsyncResource State Tracking (+7 more)

### Community 102 - "error.interceptor.ts"
Cohesion: 0.25
Nodes (12): ERROR_REPORTER, ErrorCode, ErrorReporterContext, core/errors/index.ts, CRITICAL_STATUS_CODES, ERROR_PATHS, errorInterceptor(), getHttpErrorStackTrace() (+4 more)

### Community 103 - "NotificationService"
Cohesion: 0.16
Nodes (8): CONFIRM_CONFIG, MODAL_CONFIG, NotificationService, TOAST_CONFIG, Injectable, ApiErrorBody, handleHttpError(), parseErrorMessage()

### Community 105 - "CustomTitleStrategy"
Cohesion: 0.21
Nodes (4): CustomTitleStrategy, ROUTE_DATA_KEYS, Injectable, strategies/index.ts

### Community 106 - "AuthComponent"
Cohesion: 0.17
Nodes (5): AuthComponent, AuthRouteData, readRouteString(), TranslateServiceStub, Component

### Community 107 - "inputmask.directive.ts"
Cohesion: 0.16
Nodes (10): DEFAULT_OPTIONS, DEFAULTS, InputmaskError, InputmaskValidationResult, HostComponent, InputmaskDirectiveInternals, OptionsHostComponent, setup() (+2 more)

### Community 108 - "shell.facade.spec.ts"
Cohesion: 0.14
Nodes (9): ToolbarLayout, BODY_CONSTANTS, ContainerType, DATA_ATTRIBUTES, ActivatedRouteStub, dashboardItem, layoutConfig, LayoutServiceStub (+1 more)

### Community 110 - "d3-donut-chart.directive.ts"
Cohesion: 0.23
Nodes (10): D3LegendInteraction, D3LegendItem, D3LegendLayout, D3LegendRenderOptions, D3LegendRenderResult, legendGridTemplate(), legendItemLabel(), legendItemMeta() (+2 more)

### Community 111 - "D3ProgressBreakdownDirective"
Cohesion: 0.21
Nodes (7): ProgressBreakdownItem, D3ProgressBreakdownDirective, Directive, Input, charts/index.ts, ProgressBreakdownComponent, Component

### Community 113 - "base-directive.spec.ts"
Cohesion: 0.16
Nodes (7): HostComponent, makeRenderer(), setup(), TestBaseDirective, TestOptions, Component, Directive

### Community 114 - "tree.directive.ts"
Cohesion: 0.16
Nodes (12): ContextMenuClickOutsideHandler, DropLocation, DropPosition, getContextMenuClickOutsideHandler(), setContextMenuClickOutsideHandler(), TreeCheckCallbackContext, TreeContextMenuElement, TreeError (+4 more)

### Community 115 - "InvalidFeedbackComponent"
Cohesion: 0.18
Nodes (8): InvalidFeedbackComponent, InvalidFeedbackHostComponent, Component, Component, VALIDATION_MESSAGES, VALIDATION_PRIORITY, ValidationError, ValidationErrorInfo

### Community 116 - "Shared Pipes"
Cohesion: 0.17
Nodes (13): Locale-Aware Date and Number Formatting, Internationalization and Formatting, RTL and LTR Directionality, Runtime Locale Support, Extended Date Pipe, dueIn Pipe, localeNumber Pipe, Shared Pipes (+5 more)

### Community 117 - "file-download.service.ts"
Cohesion: 0.24
Nodes (6): DownloadOptions, DownloadState, FileDownloadService, isHttpProgressEvent(), isHttpResponse(), Injectable

### Community 119 - "demo-context.store.ts"
Cohesion: 0.31
Nodes (10): buildDemoActiveAccessContext(), buildDemoActorContext(), buildDemoPermissionHints(), buildDemoUiCapabilities(), createDemoAuthFacadeState(), createDisabledDemoAuthFacadeState(), DEMO_ACTIVE_ACCESS_CONTEXT, DEMO_ACTIVE_ACTOR_CONTEXT (+2 more)

### Community 120 - "cookie-alert.directive.ts"
Cohesion: 0.17
Nodes (8): CookieAlertError, CookieAlertOptions, CookieAlertValidationResult, DEFAULT_OPTIONS, CookieAlertDirectiveInternals, HostComponent, setup(), Component

### Community 123 - "UI Architecture"
Cohesion: 0.33
Nodes (6): Navigation Permission Filtering, UI Dependency Rules, UI Folder Boundaries, Shell Navigation Pattern, Shell Facade State Pattern, UI Architecture

### Community 124 - "async-resource.ts"
Cohesion: 0.24
Nodes (6): BasicInformationService, Injectable, AsyncResource, parseError(), ResourceStatus, trackResource()

### Community 125 - "AuthFacadeState"
Cohesion: 0.26
Nodes (4): AuthFacade, AuthFacadeState, DemoAuthFacade, Injectable

### Community 126 - "demo-context.providers.ts"
Cohesion: 0.35
Nodes (5): EffectivePermissionHint, UiCapability, DemoUiCapabilityFacade, Injectable, UiCapabilityFacade

### Community 127 - "registration.component.ts"
Cohesion: 0.26
Nodes (6): AddressModel, models/auth/index.ts, FiscalYearParameters, ReservationServersInfo, UserModel, ConfirmPasswordValidator

### Community 131 - "topbar.component.spec.ts"
Cohesion: 0.26
Nodes (10): NotificationsInnerStubComponent, QuickLinksInnerStubComponent, SearchResultInnerStubComponent, ThemeModeSwitcherStubComponent, Component, Input, UserInnerStubComponent, VeloraIconStubComponent (+2 more)

### Community 132 - "CookieService"
Cohesion: 0.24
Nodes (4): CookieOptions, CookieService, DEFAULT_COOKIE_OPTIONS, Injectable

### Community 136 - "hierarchy-tree.component.ts"
Cohesion: 0.24
Nodes (5): LayoutDirection, OutlineLink, OutlineNode, TreeRenderNode, HierarchyNode

### Community 138 - "Modals, Drawers, and Wizards"
Cohesion: 0.27
Nodes (10): Actions and Permissions, Audit-Sensitive and Elevated Actions, Disabled Versus Hidden Actions, Permission-Aware Row Action Pattern, UI Capability Display Hints, Honest-Disabled Terminal Actions, Modals, Drawers, and Wizards, Ngb Modal Wrapper (+2 more)

### Community 139 - "basic-information.service.ts"
Cohesion: 0.47
Nodes (7): BasicInfo, MockCollectionName, MockRecord, MockUser, PlatformMetadata, User, in-memory-db/index.ts

### Community 140 - "fullcalendar.directive.ts"
Cohesion: 0.20
Nodes (9): BootstrapModule, DayGridModule, FullCalendarError, FullCalendarModule, FullCalendarOptions, FullCalendarValidationResult, InteractionModule, ListModule (+1 more)

### Community 142 - "D3ForceGraphDirective"
Cohesion: 0.39
Nodes (3): D3ForceGraphDirective, Directive, Input

### Community 143 - ".render"
Cohesion: 0.39
Nodes (3): D3LineChartDirective, Directive, Input

### Community 144 - "D3TimelineDirective"
Cohesion: 0.39
Nodes (3): D3TimelineDirective, Directive, Input

### Community 147 - "DateLikeControl"
Cohesion: 0.31
Nodes (6): DateControlComponent, Component, DateTimeControlComponent, Component, DateLikeControl, DATE_INPUT_IMPORTS

### Community 149 - "DeepDiffMapper"
Cohesion: 0.31
Nodes (4): DeepDiffMapper, DiffResult, DiffResultMap, DiffType

### Community 150 - "Forms and Controls"
Cohesion: 0.25
Nodes (8): Forms and Controls, Missing Standard Controls, StandardFormControl Architecture, Pagination and Selection Gaps, UI Knowledge Documentation Completion Rationale, Shared UI Implementation Gaps, UI Source Scan Coverage, UI Knowledge Generation Report

### Community 151 - "Velora Directives Catalog"
Cohesion: 0.20
Nodes (12): D3 Chart Directives, Directive Lifecycle and Host Rules, Velora Directives Catalog, External Dashboard Selector Mapping, Inputmask and Maxlength Rules, Shared DOM Behavior Directives, Standard Form Control Catalog, Generic Shared UI Components (+4 more)

### Community 152 - "Velora UI Knowledge Index"
Cohesion: 0.24
Nodes (12): Anti-Template Rule, Domain Workspace Design Rules, Domain Workspace Acceptance Gate, UI Implementation Checklist, Preimplementation Gate, Workspace Completion Checklist, Future Agent Ground Rules, Velora UI Knowledge Index (+4 more)

### Community 153 - "LoaderService"
Cohesion: 0.36
Nodes (4): LOADER_PATHS, loaderInterceptor(), LoaderService, Injectable

### Community 155 - "app.type.ts"
Cohesion: 0.25
Nodes (6): AppComponentConfig, FocusTarget, KeyboardEventConfig, ModalComponentInstance, BaseModel, common/index.ts

### Community 156 - "D3BarChartDirective"
Cohesion: 0.32
Nodes (3): D3BarChartDirective, Directive, Input

### Community 157 - "D3ScoreChartDirective"
Cohesion: 0.32
Nodes (3): D3ScoreChartDirective, Directive, Input

### Community 161 - "Hierarchy Graph"
Cohesion: 0.25
Nodes (8): Expanded Graph View, Fit to View, Hierarchy Graph Host, Hierarchy Graph Legend, Hierarchy Graph Minimap, Hierarchy Graph, Node Lock, Graph Zoom Controls

### Community 162 - "Search Interface"
Cohesion: 0.25
Nodes (8): Advanced Search, Handle Advanced Search, Handle Preference Search, Recent Searches, Search Interface, Search Preferences, Search Results, Set Search Mode

### Community 164 - "seo.service.ts"
Cohesion: 0.33
Nodes (5): APP_BRAND, BreadcrumbSchema, OrganizationSchema, StructuredDataSchema, WebPageSchema

### Community 168 - "autosize.directive.ts"
Cohesion: 0.29
Nodes (6): AutosizeError, AutosizeFactory, AutosizeOptions, AutosizeTarget, AutosizeValidationResult, DEFAULT_OPTIONS

### Community 169 - "User Menu"
Cohesion: 0.29
Nodes (7): Account Settings Route, Language Selector, Logout, Select Language, User Menu, User Profile, Users Settings Route

### Community 171 - "Form Validation Model"
Cohesion: 0.25
Nodes (9): Stepper Directive, Semantic Compare and Impact Analysis, Form Validation Model, Contextual Drawer Pattern, DeepDiffMapper, FormUtil, UI Infrastructure Services, UI Utilities (+1 more)

### Community 172 - "mock-api.interceptor.ts"
Cohesion: 0.53
Nodes (3): mockApiInterceptor(), SINGLETON_COLLECTIONS, IS_SERVER_PLATFORM

### Community 178 - "scroll.directive.spec.ts"
Cohesion: 0.40
Nodes (4): HostComponent, ScrollDirectiveInternals, setup(), Component

### Community 179 - "settings.model.ts"
Cohesion: 0.33
Nodes (5): toolbar/models/index.ts, DatabaseBackup, FiscalYear, FiscalYearParameters, FiscalYearParametersResponse

### Community 181 - "Enterprise Dashboard"
Cohesion: 0.40
Nodes (5): Authentication Login, Enterprise Dashboard, Dashboard Metrics, Foundation Areas, Platform Foundation

### Community 182 - "typed.directive.ts"
Cohesion: 0.40
Nodes (4): DEFAULT_OPTIONS, TypedError, TypedOptions, TypedValidationResult

### Community 183 - "Notification Logs"
Cohesion: 0.40
Nodes (5): Notification Alerts, Notification Logs, Notifications Menu, Set Active Notification Tab, Notification Updates

### Community 184 - "Quick Links"
Cohesion: 0.40
Nodes (5): Detail Accounts Review Route, Document Review Route, General Accounts Review Route, Quick Links, Temporary Documents Route

### Community 186 - "fake.interceptor.ts"
Cohesion: 0.67
Nodes (3): FAKE_PATHS, fakeInterceptor(), MOCK_BODY

### Community 188 - "Demo Action Modal"
Cohesion: 0.50
Nodes (4): Closed Event, Confirmation Notice, Demo Action Modal, Primary Selected Event

### Community 189 - "More Filters Dropdown"
Cohesion: 0.50
Nodes (4): Filters Apply Event, Filters Reset Event, More Filters Dropdown, Visible Filter Controls

### Community 190 - "Donut Chart"
Cohesion: 0.67
Nodes (3): D3 Donut Chart Directive, Donut Chart, Donut Segments and Legend

### Community 191 - "Gauge Chart"
Cohesion: 0.67
Nodes (3): D3 Gauge Chart Directive, Gauge Chart, Gauge Segments and Legend

### Community 192 - "Progress Breakdown"
Cohesion: 0.67
Nodes (3): D3 Progress Breakdown Directive, Normalized Progress Items, Progress Breakdown

### Community 193 - "Waterfall Chart"
Cohesion: 0.67
Nodes (3): D3 Waterfall Chart Directive, Waterfall Chart, Waterfall Legend

### Community 194 - "Invalid Feedback"
Cohesion: 0.67
Nodes (3): Get Error Info, Get Validation Parameter Text, Invalid Feedback

### Community 195 - "Button with Indicator"
Cohesion: 0.67
Nodes (3): Button with Indicator, Handle Click, Loading Indicator

### Community 196 - "Row Actions Dropdown"
Cohesion: 0.67
Nodes (3): Row Actions, Row Actions Dropdown, Select Action

### Community 197 - "Hierarchy Tree"
Cohesion: 0.67
Nodes (3): Hierarchy Tree, Hierarchy Search Input Handler, Hierarchy Tree Host

### Community 198 - "Messenger Drawer"
Cohesion: 0.67
Nodes (3): Active Messenger Contact, Messenger Drawer, Velora Drawer Directive

### Community 199 - "Modal Template"
Cohesion: 0.67
Nodes (3): Modal Configuration, Modal Template, Projected Modal Content

### Community 210 - "modular-merge.ts"
Cohesion: 0.67
Nodes (3): isTranslationTree(), mergeTranslationTree(), TranslationTree

## Knowledge Gaps
- **457 isolated node(s):** `AppRouting`, `ClassProviderRecord`, `ITrustBadge`, `IApp`, `ILayoutCSSClasses` (+452 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **56 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `Project Composition Boundary` (2× useful, score=1.999812213)
- `Versioned Master Release` (2× useful, score=1.999812213)
- `UI Architecture` (2× useful, score=1.999026957)
- `LoggerService` (2× useful, score=1.999026957)
- `PermissionService` (2× useful, score=1.999026957)
- `BaseDirective` (2× useful, score=1.999026957)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `BaseDirective` connect `BaseDirective` to `StickyDirective`, `DropzoneDirective`, `DrawerDirective`, `SearchDirective`, `AutocompleteDirective`, `fullcalendar.directive.ts`, `menu.directive.ts`, `MaxlengthDirective`, `TinySliderDirective`, `CookieAlertDirective`, `StepperDirective`, `MenuDirective`, `setOptionIfChanged`, `TagifyDirective`, `directive-helpers.ts`, `runSafely`, `ScrollDirective`, `InputmaskDirective`, `directive-host.ts`, `FullCalendarDirective`, `TreeDirective`, `ClipboardDirective`, `FlatpickrDirective`, `autosize.directive.ts`, `NoUiSliderDirective`, `DraggableDirective`, `logger.service.ts`, `AutosizeDirective`, `IfIsBrowserDirective`, `ImageInputDirective`, `ScrollTopDirective`, `CountUpDirective`, `ToggleDirective`, `typed.directive.ts`, `SwapperDirective`, `PasswordMeterDirective`, `.key`, `DialerDirective`, `TypedDirective`, `tiny-slider.directive.ts`, `inputmask.directive.ts`, `AntiAutocompleteDirective`, `base-directive.spec.ts`, `tree.directive.ts`, `cookie-alert.directive.ts`?**
  _High betweenness centrality (0.187) - this node is a cross-community bridge._
- **Why does `LoggerService` connect `LoggerService` to `.showContextMenu`, `StickyDirective`, `DropzoneDirective`, `DrawerDirective`, `ThemeModeValue`, `TranslationService`, `SearchDirective`, `AutocompleteDirective`, `.error`, `velora-icon.component.ts`, `fullcalendar.directive.ts`, `menu.directive.ts`, `MaxlengthDirective`, `TinySliderDirective`, `CookieAlertDirective`, `StepperDirective`, `MenuDirective`, `format-date.ts`, `setOptionIfChanged`, `TagifyDirective`, `base-error.component.ts`, `directive-helpers.ts`, `layout.service.ts`, `ScrollDirective`, `tokens/index.ts`, `InputmaskDirective`, `directive-host.ts`, `FullCalendarDirective`, `shell.facade.ts`, `ClipboardDirective`, `FlatpickrDirective`, `autosize.directive.ts`, `.warn`, `NoUiSliderDirective`, `DraggableDirective`, `logger.service.ts`, `BaseDirective`, `AutosizeDirective`, `IfIsBrowserDirective`, `ImageInputDirective`, `ScrollTopDirective`, `CountUpDirective`, `ToggleDirective`, `typed.directive.ts`, `AnimationUtil`, `SwapperDirective`, `PasswordMeterDirective`, `.key`, `DialerDirective`, `auth.service.ts`, `ProfilerService`, `TypedDirective`, `classic.component.ts`, `tiny-slider.directive.ts`, `NotificationService`, `inputmask.directive.ts`, `AntiAutocompleteDirective`, `base-directive.spec.ts`, `tree.directive.ts`, `cookie-alert.directive.ts`?**
  _High betweenness centrality (0.136) - this node is a cross-community bridge._
- **Why does `MenuDirective` connect `MenuDirective` to `sidebar-menu.component.ts`, `ThemeModeValue`, `.hideDropdown`, `menu.directive.ts`, `BaseDirective`, `.get`, `EventUtil`, `navbar.component.ts`, `more-filters-dropdown.component.ts`, `header.component.ts`, `.getItemSubTypeInternal`, `runSafely`, `.parseNumber`, `.remove`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Are the 34 inferred relationships involving `LoggerService` (e.g. with `languageDirectionSetup()` and `swCheckForUpdate()`) actually correct?**
  _`LoggerService` has 34 INFERRED edges - model-reasoned connections that need verification._
- **What connects `AppRouting`, `ClassProviderRecord`, `ITrustBadge` to the rest of the system?**
  _457 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `PageInfoService` be split into smaller, more focused modules?**
  _Cohesion score 0.0539906103286385 - nodes in this community are weakly interconnected._
- **Should `StickyDirective` be split into smaller, more focused modules?**
  _Cohesion score 0.06438631790744467 - nodes in this community are weakly interconnected._