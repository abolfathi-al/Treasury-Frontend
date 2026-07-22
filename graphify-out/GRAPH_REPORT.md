# Graph Report - /Users/alirezaabolfathi/Desktop/Enterprise-Treasury-Frontend  (2026-07-22)

## Corpus Check
- Large corpus: 502 files · ~212,391 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 4133 nodes · 9270 edges · 217 communities (157 shown, 60 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 391 edges (avg confidence: 0.79)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- StickyDirective Module
- DropzoneDirective Module
- DrawerDirective Module
- SearchDirective Module
- TinySliderDirective Module
- locales en ts
- locales fa ts
- format date ts
- MaxlengthDirective Module
- error Module
- AutocompleteDirective Module
- directive helpers ts
- CookieAlertDirective Module
- StepperDirective Module
- ModalConfig Module
- TagifyDirective Module
- navbar component ts
- runSafely Module
- setOptionIfChanged Module
- LoggerService Module
- logger service ts
- layout service ts
- tokens index ts
- velora icon component ts
- ScrollDirective Module
- warn Module
- InputmaskDirective Module
- app config ts
- StandardFormControl Module
- HierarchyGraphComponent Module
- shell facade ts
- directive host ts
- FullCalendarDirective Module
- TreeDirective Module
- services index ts
- ErrorUtils Module
- ClipboardDirective Module
- menu directive ts
- language initializer ts
- FlatpickrDirective Module
- MenuDirective Module
- NoUiSliderDirective Module
- TranslationService Module
- DataUtil Module
- Application Toolbar
- ThemeModeValue Module
- PageInfoService Module
- DraggableDirective Module
- CoreUtil Module
- InMemoryDbService Module
- d3 index ts
- CountUpDirective Module
- AutosizeDirective Module
- ImageInputDirective Module
- ScrollTopDirective Module
- standard control base ts
- notifications inner component ts
- ToggleDirective Module
- DemoContextStore Module
- AuthService Module
- error types ts
- HierarchyTreeComponent Module
- utils index ts
- D3WaterfallChartDirective Module
- SwapperDirective Module
- ILayout Module
- LayoutService Module
- PermissionService Module
- hierarchy graph component ts
- PasswordMeterDirective Module
- BaseDirective Module
- NamedFormControl Module
- legacy storage cleanup initializer ts
- page info service ts
- key Module
- ErrorService Module
- DialerDirective Module
- navbar component spec ts
- CssLoaderService Module
- context models ts
- css token ts
- modules i18n index ts
- ThemeModeService Module
- d3 chart types ts
- error interceptor ts
- auth service ts
- d3 gauge chart directive ts
- standard control imports ts
- KeyboardEventService Module
- search result inner component ts
- BaseErrorComponent Module
- D3DonutChartDirective Module
- NumericFormControl Module
- TypedDirective Module
- more filters dropdown component ts
- classic component ts
- ShellFacade Module
- header component ts
- ContextSwitchResult Module
- context index ts
- shared form controls spec ts
- TypeScript Locale Modules
- AppComponent Module
- SEOService Module
- ActorMembership Module
- CustomTitleStrategy Module
- AuthComponent Module
- layout component ts
- sidebar component ts
- ProfilerService Module
- d3 donut chart directive ts
- D3ProgressBreakdownDirective Module
- AntiAutocompleteDirective Module
- base directive spec ts
- tree directive ts
- InvalidFeedbackComponent Module
- Shared Pipes
- file download service ts
- TitleService Module
- cookie alert directive ts
- topbar component ts
- header component spec ts
- Velora Directives Catalog
- Velora UI Knowledge Index
- AuthFacadeState Module
- registration component ts
- topbar component spec ts
- ResponsiveUtil Module
- CookieService Module
- FocusManagementService Module
- demo context store ts
- destroyPopperInst Module
- SingleOptionDirective Module
- DueInPipe Module
- hierarchy tree component ts
- SplashScreenService Module
- Modals Drawers and Wizards
- ErrorsComponent Module
- fullcalendar directive ts
- inputmask directive spec ts
- Form Validation Model
- D3ForceGraphDirective Module
- render Module
- D3TimelineDirective Module
- DirectiveState Module
- DateLikeControl Module
- SidebarComponent Module
- DeepDiffMapper Module
- Forms and Controls
- seo service ts
- loaderInterceptor Module
- LocalStoragePolyfillImpl Module
- D3BarChartDirective Module
- D3ScoreChartDirective Module
- autocomplete directive ts
- Hierarchy Graph
- Search Interface
- AuthSessionPort Module
- AppInitializationService Module
- MemoryStorage Module
- MemoryStorage Module
- autosize directive ts
- User Menu
- UI Architecture
- header interceptor ts
- mockApiInterceptor Module
- AuthGuard Module
- ForgotPasswordComponent Module
- RegistrationComponent Module
- D3ChartHostDirective Module
- IfIsBrowserDirective Module
- scroll directive spec ts
- Notification Tabs
- UserInnerComponent Module
- settings model ts
- app config spec ts
- Enterprise Dashboard
- inputmask directive ts
- Quick Links
- fake interceptor ts
- modular merge ts
- Demo Action Modal
- More Filters Dropdown
- LayoutServiceStub Module
- TranslateServiceStub Module
- page visibility token ts
- saver token ts
- TranslateServiceStub Module
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
- Error Shell
- Paragraph Skeleton
- Hierarchy Node Card
- Full Hierarchy Path
- Loading Indicator
- resolveD3ChartTheme Module

## God Nodes (most connected - your core abstractions)
1. `runSafely()` - 135 edges
2. `LoggerService` - 132 edges
3. `TreeDirective` - 118 edges
4. `MenuDirective` - 117 edges
5. `BaseDirective` - 89 edges
6. `StickyDirective` - 73 edges
7. `DropzoneDirective` - 58 edges
8. `SearchDirective` - 58 edges
9. `DrawerDirective` - 57 edges
10. `MaxlengthDirective` - 54 edges

## Surprising Connections (you probably didn't know these)
- `Registration Reactive Form` --implements--> `Form Validation Model`  [INFERRED]
  src/app/modules/auth/pages/registration/registration.component.html → docs/ui/forms-and-controls.md
- `Logout Template` --conceptually_related_to--> `TypeScript Locale Modules`  [INFERRED]
  src/app/modules/auth/pages/logout/logout.component.html → docs/ui/i18n-and-formatting.md
- `Directive Lifecycle and Host Rules` --semantically_similar_to--> `UI Dependency Rules`  [INFERRED] [semantically similar]
  docs/ui/directives.md → docs/ui/ui-architecture.md
- `Login Template` --conceptually_related_to--> `TypeScript Locale Modules`  [INFERRED]
  src/app/modules/auth/pages/login/login.component.html → docs/ui/i18n-and-formatting.md
- `Registration Template` --conceptually_related_to--> `TypeScript Locale Modules`  [INFERRED]
  src/app/modules/auth/pages/registration/registration.component.html → docs/ui/i18n-and-formatting.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Domain UI Acceptance System** — docs_ui_domain_workspace_design_rules_workspace_acceptance_gate, docs_ui_implementation_checklist_workspace_completion_gate, docs_ui_tables_and_grids_table_acceptance_gate, docs_ui_states_loading_error_empty_partial_validation_states, docs_ui_actions_permissions_disabled_vs_hidden [EXTRACTED 1.00]
- **Authentication Route Template Composition** — src_app_app_component_root_router_outlet, src_app_modules_auth_pages_auth_shell_auth_component_auth_shell_template, src_app_modules_auth_pages_login_login_component_login_template, src_app_modules_auth_pages_registration_registration_component_registration_template, src_app_modules_auth_pages_logout_logout_component_logout_template [INFERRED 0.85]
- **Resilient Error Experience** — docs_ui_states_loading_error_empty_error_states, docs_ui_states_loading_error_empty_loading_states, docs_ui_states_loading_error_empty_partial_validation_states, src_app_modules_errors_pages_error404_error404_component_error404_template, src_app_modules_errors_pages_error500_error500_component_error500_template [INFERRED 0.95]
- **Shared Chart Visualizations** — src_app_shared_charts_donut_chart_donut_chart_component_donut_chart, src_app_shared_charts_gauge_chart_gauge_chart_component_gauge_chart, src_app_shared_charts_progress_breakdown_progress_breakdown_component_progress_breakdown, src_app_shared_charts_waterfall_chart_waterfall_chart_component_waterfall_chart [INFERRED 0.95]
- **Scope Hierarchy Interface** — src_app_shared_ui_hierarchy_hierarchy_graph_hierarchy_graph_component_hierarchy_graph, src_app_shared_ui_hierarchy_hierarchy_node_card_hierarchy_node_card_component_hierarchy_node_card, src_app_shared_ui_hierarchy_hierarchy_path_preview_hierarchy_path_preview_component_hierarchy_path_preview, src_app_shared_ui_hierarchy_hierarchy_tree_hierarchy_tree_component_hierarchy_tree [INFERRED 0.95]
- **Shell Navigation Utilities** — src_app_shell_components_extras_dropdown_inner_notifications_inner_notifications_inner_component_notifications_menu, src_app_shell_components_extras_dropdown_inner_quick_links_inner_quick_links_inner_component_quick_links, src_app_shell_components_extras_dropdown_inner_search_result_inner_search_result_inner_component_search_interface, src_app_shell_components_extras_dropdown_inner_user_inner_user_inner_component_user_menu [INFERRED 0.85]
- **Application Shell Regions** — src_app_shell_layout_layout_component_application_shell, src_app_shell_layout_components_header_header_component_application_header, src_app_shell_layout_components_sidebar_sidebar_component_application_sidebar, src_app_shell_layout_components_toolbar_toolbar_component_application_toolbar, src_app_shell_layout_components_content_content_component_routed_content, src_app_shell_layout_components_footer_footer_component_application_footer [EXTRACTED 1.00]
- **Header Navigation Composition** — src_app_shell_layout_components_header_header_component_application_header, src_app_shell_layout_components_header_header_menu_header_menu_component_header_menu, src_app_shell_layout_components_header_navbar_navbar_component_header_navbar, src_app_shell_layout_components_header_page_title_page_title_component_page_title [EXTRACTED 1.00]
- **Toolbar Layout Variants** — src_app_shell_layout_components_toolbar_toolbar_component_application_toolbar, src_app_shell_layout_components_toolbar_classic_classic_component_classic_toolbar, src_app_shell_layout_components_toolbar_accounting_accounting_component_accounting_toolbar, src_app_shell_layout_components_toolbar_extended_extended_component_extended_toolbar, src_app_shell_layout_components_toolbar_reports_reports_component_reports_toolbar, src_app_shell_layout_components_toolbar_saas_saas_component_saas_toolbar [EXTRACTED 1.00]

## Communities (217 total, 60 thin omitted)

### Community 1 - "DropzoneDirective Module"
Cohesion: 0.05
Nodes (12): DropzoneDirective, DropzoneError, DropzoneOptions, hasDropzoneRemoveHandler(), markDropzoneRemoveHandler(), AssertAll, DropzonePublicTypeContracts, IsAny (+4 more)

### Community 2 - "DrawerDirective Module"
Cohesion: 0.07
Nodes (6): DrawerDirective, DrawerStore, HostComponent, setup(), Component, Directive

### Community 3 - "SearchDirective Module"
Cohesion: 0.07
Nodes (6): SearchResultItem, SearchDirective, HostComponent, setup(), Component, Directive

### Community 4 - "TinySliderDirective Module"
Cohesion: 0.07
Nodes (8): EmptyHostComponent, HostComponent, setup(), setupEmpty(), TinySliderDirectiveInternals, Component, TinySliderDirective, Directive

### Community 5 - "locales en ts"
Cohesion: 0.05
Nodes (28): accessDomainEn, auditDomainEn, identityDomainEn, organizationDomainEn, tenantDomainEn, veloraShellEnLocale, accessRequestsWorkspaceEn, accessSimulatorWorkspaceEn (+20 more)

### Community 6 - "locales fa ts"
Cohesion: 0.05
Nodes (28): accessDomainFa, auditDomainFa, identityDomainFa, organizationDomainFa, tenantDomainFa, veloraShellFaLocale, accessRequestsWorkspaceFa, accessSimulatorWorkspaceFa (+20 more)

### Community 7 - "format date ts"
Cohesion: 0.07
Nodes (40): flatpickrConfig, parseDate(), TIME_COMPONENTS, ExtendDatePipe, Pipe, LocaleNumberPipe, toEnglish(), toPersian() (+32 more)

### Community 9 - "error Module"
Cohesion: 0.09
Nodes (4): ClassicComponent, Component, AnimationUtil, DomUtil

### Community 11 - "directive helpers ts"
Cohesion: 0.06
Nodes (33): ClipboardError, ClipboardFactory, ClipboardValidationResult, DEFAULT_OPTIONS, CountUpCtor, CountUpError, CountUpOptions, CountUpValidationResult (+25 more)

### Community 13 - "StepperDirective Module"
Cohesion: 0.09
Nodes (4): LoginComponent, Component, StepperDirective, Directive

### Community 14 - "ModalConfig Module"
Cohesion: 0.05
Nodes (16): CoercionBackingStore, ConditionalCall(), ConditionalMethod, ConditionalHost, addCancelMethod(), Debounce(), DebouncedSourceMethod, hasSameArgs() (+8 more)

### Community 16 - "navbar component ts"
Cohesion: 0.09
Nodes (22): AUTH_SESSION, AuthenticatedRequestUser, AuthUserSnapshot, getUserByToken(), AUTH_PATHS, authInterceptor(), refreshTokenSubject, LOCATION (+14 more)

### Community 17 - "runSafely Module"
Cohesion: 0.12
Nodes (5): createSafeExecutor(), invokeCallbackSafely(), LoggerAdapter, runSafely(), emitSafely()

### Community 18 - "setOptionIfChanged Module"
Cohesion: 0.06
Nodes (26): DEFAULT_OPTIONS, FlatpickrError, FlatpickrFactory, FlatpickrInstance, FlatpickrNativeOptions, FlatpickrOptions, FlatpickrValidationResult, GlobalFlatpickrRegistry (+18 more)

### Community 19 - "LoggerService Module"
Cohesion: 0.09
Nodes (8): setupUnrecoverableHandling(), setupUpdateChecking(), setupVersionActivation(), ApplicationRefStub, SwUpdateStub, swCheckForUpdate(), LoggerService, Injectable

### Community 20 - "logger service ts"
Cohesion: 0.06
Nodes (30): DEFAULT_CONFIG, LOG_LEVEL_NAMES, LogConfig, LogEntry, LOGGER_CONSTANTS, LogLevel, SanitizedLogEntry, ProfilerLog (+22 more)

### Community 21 - "layout service ts"
Cohesion: 0.09
Nodes (30): CSSClassesType, HTMLAttributesType, IApp, IContent, IEngage, IFooter, IGeneral, IHeader (+22 more)

### Community 22 - "tokens index ts"
Cohesion: 0.10
Nodes (15): backForwardCacheSetup(), ANIMATION_FRAME, CACHES, CRYPTO, HISTORY, LOCAL_STORAGE, MEDIA_DEVICES, NAVIGATOR (+7 more)

### Community 23 - "velora icon component ts"
Cohesion: 0.08
Nodes (26): ToolbarLayout, DashboardComponent, DashboardMetric, FoundationArea, Component, isVeloraIconType(), Component, VELORA_ICON_CONSTANTS (+18 more)

### Community 24 - "ScrollDirective Module"
Cohesion: 0.12
Nodes (3): ScrollDirective, ScrollResponsiveValue, Directive

### Community 25 - "warn Module"
Cohesion: 0.12
Nodes (5): ToolbarComponent, Component, LayoutComponent, Component, StyleUtil

### Community 27 - "app config ts"
Cohesion: 0.11
Nodes (25): APP_CONFIG_CONSTANTS, AppProvidersConfig, buildInitializers(), buildInterceptors(), buildModuleProviders(), buildRouterProviders(), buildServiceWorkerProvider(), ensureLocaleData() (+17 more)

### Community 29 - "HierarchyGraphComponent Module"
Cohesion: 0.12
Nodes (3): HierarchyGraphComponent, Component, ViewChild

### Community 30 - "shell facade ts"
Cohesion: 0.11
Nodes (24): PageNavigationActiveMatch, PageNavigationItemKind, SHELL_NAVIGATION_LABEL_KEYS, ShellNavigationFacade, Injectable, ShellNavigationActiveMatch, ShellNavigationItem, ShellNavigationItemKind (+16 more)

### Community 31 - "directive host ts"
Cohesion: 0.08
Nodes (23): ATTRIBUTES, AutocompleteMode, CONSTANTS, DEFAULT_OPTIONS, DialerChangeEvent, DialerOptions, DEFAULT_CONFIG, DragEvent (+15 more)

### Community 34 - "services index ts"
Cohesion: 0.10
Nodes (15): AppInitializationConfig, GlobalEventsService, KEY, Injectable, FocusManagementConfig, KeyboardEventHandlers, CONFIRM_CONFIG, MODAL_CONFIG (+7 more)

### Community 35 - "ErrorUtils Module"
Cohesion: 0.16
Nodes (9): buildErrorReporter(), ErrorUtils, isRecord(), readErrorCode(), readErrorPayload(), readRecord(), readStatus(), readString() (+1 more)

### Community 36 - "ClipboardDirective Module"
Cohesion: 0.12
Nodes (3): ClipboardDirective, ClipboardOptions, Directive

### Community 37 - "menu directive ts"
Cohesion: 0.09
Nodes (21): DEFAULT_OPTIONS, DrawerOptions, DrawerStateChangeEvent, CSS, DEFAULT_OPTIONS, MenuDirectiveWindow, MenuItemConfig, MenuOptions (+13 more)

### Community 38 - "language initializer ts"
Cohesion: 0.10
Nodes (17): LANGUAGE_SERVICE, LanguageDirection, LanguageServicePort, TranslationData, TranslationDataValue, addThemeLink(), applyHtmlAttributes(), hasThemeLink() (+9 more)

### Community 42 - "TranslationService Module"
Cohesion: 0.10
Nodes (10): Locale, LanguageConfig, RTL_LANGUAGES, RUNTIME_LOCALE_CODES, RUNTIME_LOCALE_LOADERS, RuntimeLocaleCode, RuntimeLocaleLoader, SUPPORTED_LANGUAGES (+2 more)

### Community 44 - "Application Toolbar"
Cohesion: 0.07
Nodes (31): Theme Mode Switcher, Light, Dark, and System Theme Modes, Routed Content Region, Router Outlet, Application Footer, Application Header, Sidebar Toggle, Dashboard Route (+23 more)

### Community 45 - "ThemeModeValue Module"
Cohesion: 0.17
Nodes (12): resolveInitializerMode(), themeModeSetup(), ThemeModeDomService, Injectable, isThemeModeValue(), THEME_MODE_ATTRIBUTES, THEME_MODE_DEFAULTS, THEME_MODE_IMAGE_ATTRIBUTES (+4 more)

### Community 49 - "InMemoryDbService Module"
Cohesion: 0.14
Nodes (10): BasicInformationService, Injectable, InMemoryDbService, Injectable, BasicInfo, MockCollectionName, MockRecord, MockUser (+2 more)

### Community 50 - "d3 index ts"
Cohesion: 0.30
Nodes (14): applySvgAccessibility(), renderEmptyState(), compactD3ChartLabel(), formatD3ChartValue(), chartSize(), DEFAULT_D3_CHART_MARGIN, mergedMargin(), normalizePercent() (+6 more)

### Community 53 - "ImageInputDirective Module"
Cohesion: 0.16
Nodes (3): ImageInputDirective, ImageInputStore, Directive

### Community 54 - "ScrollTopDirective Module"
Cohesion: 0.14
Nodes (6): ScrollTopDirective, BlankRouteComponent, HostComponent, setup(), Component, Directive

### Community 55 - "standard control base ts"
Cohesion: 0.13
Nodes (14): AsyncSelectControlComponent, Component, MembershipSelectorControlComponent, Component, MultiSelectControlComponent, Component, OrganizationSelectorControlComponent, Component (+6 more)

### Community 56 - "notifications inner component ts"
Cohesion: 0.09
Nodes (18): AlertModel, defaultAlerts, defaultLogs, LogModel, NOTIFICATIONS_INNER_CONSTANTS, NotificationsInnerComponent, NotificationsTabsType, InlineSvgStubDirective (+10 more)

### Community 57 - "ToggleDirective Module"
Cohesion: 0.14
Nodes (5): HostComponent, setup(), Component, ToggleDirective, Directive

### Community 58 - "DemoContextStore Module"
Cohesion: 0.17
Nodes (5): buildDemoActiveAccessContext(), buildDemoActorContext(), DEMO_ORGANIZATION_MEMBERSHIPS, DemoContextStore, Injectable

### Community 59 - "AuthService Module"
Cohesion: 0.14
Nodes (3): AuthModel, AuthService, Injectable

### Community 60 - "error types ts"
Cohesion: 0.18
Nodes (10): ErrorRouteData, ErrorsRouting, ERROR_CODES, ErrorConfig, ErrorInfo, isErrorCode(), Error404Component, Component (+2 more)

### Community 62 - "HierarchyTreeComponent Module"
Cohesion: 0.14
Nodes (3): HierarchyTreeComponent, Component, ViewChild

### Community 63 - "utils index ts"
Cohesion: 0.12
Nodes (13): NotificationService, Injectable, AsyncResource, parseError(), ResourceStatus, trackResource(), FieldValueChange, FormFieldState (+5 more)

### Community 64 - "D3WaterfallChartDirective Module"
Cohesion: 0.13
Nodes (12): ChartTone, getElementDirection(), WaterfallChartItem, D3WaterfallChartDirective, Directive, Input, WaterfallBar, Component (+4 more)

### Community 66 - "ILayout Module"
Cohesion: 0.23
Nodes (4): ILayout, LayoutInitService, Injectable, LayoutServiceStub

### Community 67 - "LayoutService Module"
Cohesion: 0.19
Nodes (3): LayoutType, LayoutService, Injectable

### Community 69 - "hierarchy graph component ts"
Cohesion: 0.13
Nodes (16): GraphLegendItem, LayoutDirection, MiniMapLink, MiniMapNode, PositionedLink, PositionedNode, HierarchyNodeCardComponent, Component (+8 more)

### Community 71 - "BaseDirective Module"
Cohesion: 0.11
Nodes (3): BaseDirective, BaseRenderer, syncInputsToOptions()

### Community 72 - "NamedFormControl Module"
Cohesion: 0.12
Nodes (9): BooleanControlComponent, Component, NamedFormControl, PasswordFormControl, TagsFormControl, TextualFormControl, Directive, TagsControlComponent (+1 more)

### Community 73 - "legacy storage cleanup initializer ts"
Cohesion: 0.13
Nodes (11): cleanupLegacyStorage(), LEGACY_NAMESPACE_CHAR_CODES, LEGACY_STORAGE_KEY_SUFFIXES, legacyNamespace(), legacyStorageCleanupSetup(), legacyStorageKeyPrefixes(), legacyStorageKeys(), shouldRemoveLegacyStorageKey() (+3 more)

### Community 74 - "page info service ts"
Cohesion: 0.18
Nodes (11): PageNavigationItem, PAGE_NAVIGATION_ITEMS, isPageNavigationItemActive(), isPageNavigationItemCurrentPage(), normalizePageNavigationUrl(), PageInfo, PageLink, translations (+3 more)

### Community 76 - "ErrorService Module"
Cohesion: 0.16
Nodes (5): ErrorService, Injectable, ErrorCode, ErrorContext, ErrorReport

### Community 78 - "navbar component spec ts"
Cohesion: 0.14
Nodes (18): NavbarComponent, MenuDirectiveStub, NotificationsInnerStubComponent, QuickLinksInnerStubComponent, SearchDirectiveStub, SearchResultInnerStubComponent, ThemeModeSwitcherStubComponent, Component (+10 more)

### Community 80 - "context models ts"
Cohesion: 0.15
Nodes (14): ActorType, AuthFacadeStatus, ConsumerActorSubtype, ContextStatus, EffectivePermissionHint, IdentitySummary, MembershipStatus, OrganizationType (+6 more)

### Community 81 - "css token ts"
Cohesion: 0.11
Nodes (15): StandardSpeechRecognition, WebkitSpeechRecognition, CSS, CssApi, fallbackCssApi, resolveCssApi(), WindowWithCssApi, NavigatorWithNetworkInformation (+7 more)

### Community 82 - "modules i18n index ts"
Cohesion: 0.10
Nodes (10): commonEn, commonFa, layoutEn, layoutFa, navigationEn, navigationFa, statusEn, statusFa (+2 more)

### Community 83 - "ThemeModeService Module"
Cohesion: 0.14
Nodes (8): ThemeModeService, Injectable, MenuDirectiveStub, ThemeModeServiceStub, Component, Directive, Input, VeloraIconStubComponent

### Community 84 - "d3 chart types ts"
Cohesion: 0.14
Nodes (18): D3ChartDirectiveHostComponent, Component, D3ChartSize, ChartDirection, ChartToneInput, D3ChartConfig, D3ChartDatum, D3ChartLegend (+10 more)

### Community 85 - "error interceptor ts"
Cohesion: 0.18
Nodes (12): ERROR_REPORTER, ErrorCode, ErrorReporterContext, ErrorReporterPort, CRITICAL_STATUS_CODES, ERROR_PATHS, errorInterceptor(), getHttpErrorStackTrace() (+4 more)

### Community 86 - "auth service ts"
Cohesion: 0.19
Nodes (7): AuthRouting, AuthState, UserType, Permission, ErrorStates, LogoutComponent, Component

### Community 87 - "d3 gauge chart directive ts"
Cohesion: 0.19
Nodes (10): GaugeChartSegment, getChartColorClass(), getChartTone(), getDefaultChartTone(), D3GaugeChartDirective, D3GaugeSegment, Directive, Input (+2 more)

### Community 88 - "standard control imports ts"
Cohesion: 0.18
Nodes (8): SingleSelectControlComponent, Component, DIALER_INPUT_IMPORTS, PASSWORD_INPUT_IMPORTS, SINGLE_SELECT_IMPORTS, TAGIFY_INPUT_IMPORTS, TEXT_INPUT_IMPORTS, TEXTAREA_INPUT_IMPORTS

### Community 90 - "search result inner component ts"
Cohesion: 0.12
Nodes (7): Modes, recentlySearchedModels, ResultModel, resultModels, SEARCH_RESULT_INNER_CONSTANTS, SearchResultInnerComponent, Component

### Community 91 - "BaseErrorComponent Module"
Cohesion: 0.15
Nodes (3): BaseErrorComponent, readRouteString(), Component

### Community 92 - "D3DonutChartDirective Module"
Cohesion: 0.21
Nodes (8): DonutChartLegendSegment, DonutChartSegment, D3DonutChartDirective, D3DonutSegment, Directive, Input, DonutChartComponent, Component

### Community 93 - "NumericFormControl Module"
Cohesion: 0.15
Nodes (9): InputmaskOptions, CurrencyControlComponent, Component, NumberControlComponent, Component, PercentControlComponent, Component, NumericFormControl (+1 more)

### Community 95 - "more filters dropdown component ts"
Cohesion: 0.18
Nodes (10): RowActionItem, RowActionTone, WorkspaceFilterKey, FILTER_CONTROLS, FilterControl, MoreFiltersDropdownComponent, Component, RowActionsDropdownComponent (+2 more)

### Community 96 - "classic component ts"
Cohesion: 0.14
Nodes (10): CLASSIC_TOOLBAR_CONSTANTS, ClassicToolbarLayoutState, ClassicToolbarLayoutConfig, layoutConfig, LayoutServiceStub, TranslateServiceStub, resolveClassicToolbarCommands(), ShellToolbarCommand (+2 more)

### Community 97 - "ShellFacade Module"
Cohesion: 0.15
Nodes (3): isLayoutType(), ShellFacade, Injectable

### Community 98 - "header component ts"
Cohesion: 0.15
Nodes (9): BODY_CONSTANTS, ContainerType, DATA_ATTRIBUTES, HeaderComponent, Component, checkIsActive(), getCurrentUrl(), HeaderMenuComponent (+1 more)

### Community 99 - "ContextSwitchResult Module"
Cohesion: 0.26
Nodes (6): ActiveAccessContextFacade, ActiveAccessContext, ContextSwitchRequest, ContextSwitchResult, DemoActiveAccessContextFacade, Injectable

### Community 100 - "context index ts"
Cohesion: 0.25
Nodes (6): OrganizationContext, OrganizationMembership, DemoOrganizationContextFacade, Injectable, OrganizationContextFacade, SessionStorageAdapter

### Community 102 - "shared form controls spec ts"
Cohesion: 0.15
Nodes (15): DialerControlComponent, Component, PasswordControlComponent, Component, DisabledExistingControlHostComponent, DynamicControlHostComponent, ExistingControlHostComponent, SharedFormControlsHostComponent (+7 more)

### Community 103 - "TypeScript Locale Modules"
Cohesion: 0.18
Nodes (15): Invalid Feedback Rendering, TypeScript Locale Modules, Domain-Specific Empty State Pattern, Route and Local Error States, Scoped Loading States, Partial Data and Validation States, Loading, Error, Empty, Partial, and Validation States, AsyncResource State Tracking (+7 more)

### Community 106 - "ActorMembership Module"
Cohesion: 0.24
Nodes (6): ActorContextFacade, ActorContext, ActorMembership, DemoActorContextFacade, Injectable, DEMO_ACTOR_MEMBERSHIPS

### Community 107 - "CustomTitleStrategy Module"
Cohesion: 0.21
Nodes (3): CustomTitleStrategy, ROUTE_DATA_KEYS, Injectable

### Community 108 - "AuthComponent Module"
Cohesion: 0.17
Nodes (5): AuthComponent, AuthRouteData, readRouteString(), TranslateServiceStub, Component

### Community 109 - "layout component ts"
Cohesion: 0.18
Nodes (7): ContentComponent, RouterStub, Component, FooterComponent, Component, LAYOUT_CONSTANTS, Routing

### Community 110 - "sidebar component ts"
Cohesion: 0.19
Nodes (11): SIDEBAR_FOOTER_CONSTANTS, SidebarFooterComponent, Component, SidebarMenuComponent, MenuDirectiveStub, ScrollDirectiveStub, Component, Directive (+3 more)

### Community 111 - "ProfilerService Module"
Cohesion: 0.22
Nodes (4): PROFILER_PATHS, profilerInterceptor(), ProfilerService, Injectable

### Community 112 - "d3 donut chart directive ts"
Cohesion: 0.23
Nodes (10): D3LegendInteraction, D3LegendItem, D3LegendLayout, D3LegendRenderOptions, D3LegendRenderResult, legendGridTemplate(), legendItemLabel(), legendItemMeta() (+2 more)

### Community 113 - "D3ProgressBreakdownDirective Module"
Cohesion: 0.21
Nodes (6): ProgressBreakdownItem, D3ProgressBreakdownDirective, Directive, Input, ProgressBreakdownComponent, Component

### Community 115 - "base directive spec ts"
Cohesion: 0.16
Nodes (7): HostComponent, makeRenderer(), setup(), TestBaseDirective, TestOptions, Component, Directive

### Community 116 - "tree directive ts"
Cohesion: 0.16
Nodes (12): ContextMenuClickOutsideHandler, DropLocation, DropPosition, getContextMenuClickOutsideHandler(), setContextMenuClickOutsideHandler(), TreeCheckCallbackContext, TreeContextMenuElement, TreeError (+4 more)

### Community 117 - "InvalidFeedbackComponent Module"
Cohesion: 0.18
Nodes (8): InvalidFeedbackComponent, InvalidFeedbackHostComponent, Component, Component, VALIDATION_MESSAGES, VALIDATION_PRIORITY, ValidationError, ValidationErrorInfo

### Community 118 - "Shared Pipes"
Cohesion: 0.17
Nodes (13): Locale-Aware Date and Number Formatting, Internationalization and Formatting, RTL and LTR Directionality, Runtime Locale Support, Extended Date Pipe, dueIn Pipe, localeNumber Pipe, Shared Pipes (+5 more)

### Community 119 - "file download service ts"
Cohesion: 0.24
Nodes (6): DownloadOptions, DownloadState, FileDownloadService, isHttpProgressEvent(), isHttpResponse(), Injectable

### Community 121 - "cookie alert directive ts"
Cohesion: 0.17
Nodes (8): CookieAlertError, CookieAlertOptions, CookieAlertValidationResult, DEFAULT_OPTIONS, CookieAlertDirectiveInternals, HostComponent, setup(), Component

### Community 125 - "topbar component ts"
Cohesion: 0.21
Nodes (6): isThemeMenuPlacement(), THEME_MODE_SWITCHER_CONSTANTS, ThemeMenuPlacement, ThemeModeSwitcherComponent, Component, TOPBAR_CONSTANTS

### Community 126 - "header component spec ts"
Cohesion: 0.28
Nodes (11): DrawerDirectiveStub, HeaderMenuStubComponent, MenuDirectiveStub, NavbarStubComponent, PageTitleStubComponent, SwapperDirectiveStub, ToggleDirectiveStub, Component (+3 more)

### Community 127 - "Velora Directives Catalog"
Cohesion: 0.20
Nodes (12): D3 Chart Directives, Directive Lifecycle and Host Rules, Velora Directives Catalog, External Dashboard Selector Mapping, Inputmask and Maxlength Rules, Shared DOM Behavior Directives, Standard Form Control Catalog, Generic Shared UI Components (+4 more)

### Community 128 - "Velora UI Knowledge Index"
Cohesion: 0.24
Nodes (12): Anti-Template Rule, Domain Workspace Design Rules, Domain Workspace Acceptance Gate, UI Implementation Checklist, Preimplementation Gate, Workspace Completion Checklist, Future Agent Ground Rules, Velora UI Knowledge Index (+4 more)

### Community 129 - "AuthFacadeState Module"
Cohesion: 0.26
Nodes (4): AuthFacade, AuthFacadeState, DemoAuthFacade, Injectable

### Community 130 - "registration component ts"
Cohesion: 0.26
Nodes (5): AddressModel, FiscalYearParameters, ReservationServersInfo, UserModel, ConfirmPasswordValidator

### Community 133 - "topbar component spec ts"
Cohesion: 0.26
Nodes (10): NotificationsInnerStubComponent, QuickLinksInnerStubComponent, SearchResultInnerStubComponent, ThemeModeSwitcherStubComponent, Component, Input, UserInnerStubComponent, VeloraIconStubComponent (+2 more)

### Community 135 - "CookieService Module"
Cohesion: 0.24
Nodes (4): CookieOptions, CookieService, DEFAULT_COOKIE_OPTIONS, Injectable

### Community 137 - "demo context store ts"
Cohesion: 0.36
Nodes (8): buildDemoPermissionHints(), buildDemoUiCapabilities(), createDemoAuthFacadeState(), createDisabledDemoAuthFacadeState(), DEMO_ACTIVE_ACCESS_CONTEXT, DEMO_ACTIVE_ACTOR_CONTEXT, DEMO_IDENTITY, DEMO_ORGANIZATION_CONTEXTS

### Community 139 - "SingleOptionDirective Module"
Cohesion: 0.29
Nodes (3): CHECK_DELAYS_MS, SingleOptionDirective, Directive

### Community 142 - "hierarchy tree component ts"
Cohesion: 0.24
Nodes (5): LayoutDirection, OutlineLink, OutlineNode, TreeRenderNode, HierarchyNode

### Community 143 - "SplashScreenService Module"
Cohesion: 0.20
Nodes (4): SplashScreenComponent, Component, SplashScreenService, Injectable

### Community 144 - "Modals Drawers and Wizards"
Cohesion: 0.27
Nodes (10): Actions and Permissions, Audit-Sensitive and Elevated Actions, Disabled Versus Hidden Actions, Permission-Aware Row Action Pattern, UI Capability Display Hints, Honest-Disabled Terminal Actions, Modals, Drawers, and Wizards, Ngb Modal Wrapper (+2 more)

### Community 146 - "fullcalendar directive ts"
Cohesion: 0.20
Nodes (9): BootstrapModule, DayGridModule, FullCalendarError, FullCalendarModule, FullCalendarOptions, FullCalendarValidationResult, InteractionModule, ListModule (+1 more)

### Community 147 - "inputmask directive spec ts"
Cohesion: 0.27
Nodes (6): HostComponent, InputmaskDirectiveInternals, OptionsHostComponent, setup(), setupOptionsHost(), Component

### Community 149 - "Form Validation Model"
Cohesion: 0.25
Nodes (9): Stepper Directive, Semantic Compare and Impact Analysis, Form Validation Model, Contextual Drawer Pattern, DeepDiffMapper, FormUtil, UI Infrastructure Services, UI Utilities (+1 more)

### Community 150 - "D3ForceGraphDirective Module"
Cohesion: 0.39
Nodes (3): D3ForceGraphDirective, Directive, Input

### Community 151 - "render Module"
Cohesion: 0.39
Nodes (3): D3LineChartDirective, Directive, Input

### Community 152 - "D3TimelineDirective Module"
Cohesion: 0.39
Nodes (3): D3TimelineDirective, Directive, Input

### Community 155 - "DateLikeControl Module"
Cohesion: 0.31
Nodes (6): DateControlComponent, Component, DateTimeControlComponent, Component, DateLikeControl, DATE_INPUT_IMPORTS

### Community 157 - "DeepDiffMapper Module"
Cohesion: 0.31
Nodes (4): DeepDiffMapper, DiffResult, DiffResultMap, DiffType

### Community 158 - "Forms and Controls"
Cohesion: 0.25
Nodes (8): Forms and Controls, Missing Standard Controls, StandardFormControl Architecture, Pagination and Selection Gaps, UI Knowledge Documentation Completion Rationale, Shared UI Implementation Gaps, UI Source Scan Coverage, UI Knowledge Generation Report

### Community 159 - "seo service ts"
Cohesion: 0.29
Nodes (5): APP_BRAND, BreadcrumbSchema, OrganizationSchema, StructuredDataSchema, WebPageSchema

### Community 160 - "loaderInterceptor Module"
Cohesion: 0.36
Nodes (4): LOADER_PATHS, loaderInterceptor(), LoaderService, Injectable

### Community 162 - "D3BarChartDirective Module"
Cohesion: 0.32
Nodes (3): D3BarChartDirective, Directive, Input

### Community 163 - "D3ScoreChartDirective Module"
Cohesion: 0.32
Nodes (3): D3ScoreChartDirective, Directive, Input

### Community 164 - "autocomplete directive ts"
Cohesion: 0.25
Nodes (7): AutocompleteConfig, AutocompleteCustomEvent, AutocompleteDataSource, AutocompleteError, AutocompleteItem, DEFAULT_OPTIONS, EVENTS

### Community 167 - "Hierarchy Graph"
Cohesion: 0.25
Nodes (8): Expanded Graph View, Fit to View, Hierarchy Graph Host, Hierarchy Graph Legend, Hierarchy Graph Minimap, Hierarchy Graph, Node Lock, Graph Zoom Controls

### Community 168 - "Search Interface"
Cohesion: 0.25
Nodes (8): Advanced Search, Handle Advanced Search, Handle Preference Search, Recent Searches, Search Interface, Search Preferences, Search Results, Set Search Mode

### Community 173 - "autosize directive ts"
Cohesion: 0.29
Nodes (6): AutosizeError, AutosizeFactory, AutosizeOptions, AutosizeTarget, AutosizeValidationResult, DEFAULT_OPTIONS

### Community 174 - "User Menu"
Cohesion: 0.29
Nodes (7): Account Settings Route, Language Selector, Logout, Select Language, User Menu, User Profile, Users Settings Route

### Community 175 - "UI Architecture"
Cohesion: 0.33
Nodes (6): Navigation Permission Filtering, UI Dependency Rules, UI Folder Boundaries, Shell Navigation Pattern, Shell Facade State Pattern, UI Architecture

### Community 176 - "header interceptor ts"
Cohesion: 0.47
Nodes (3): HEADER_PATHS, headerInterceptor(), TranslateServiceStub

### Community 177 - "mockApiInterceptor Module"
Cohesion: 0.53
Nodes (3): mockApiInterceptor(), SINGLETON_COLLECTIONS, IS_SERVER_PLATFORM

### Community 183 - "scroll directive spec ts"
Cohesion: 0.40
Nodes (4): HostComponent, ScrollDirectiveInternals, setup(), Component

### Community 184 - "Notification Tabs"
Cohesion: 0.33
Nodes (6): Notification Alerts, Notification Logs, Notification Tabs, Notifications Menu, Set Active Notification Tab, Notification Updates

### Community 186 - "settings model ts"
Cohesion: 0.33
Nodes (4): DatabaseBackup, FiscalYear, FiscalYearParameters, FiscalYearParametersResponse

### Community 188 - "Enterprise Dashboard"
Cohesion: 0.40
Nodes (5): Authentication Login, Enterprise Dashboard, Dashboard Metrics, Foundation Areas, Platform Foundation

### Community 189 - "inputmask directive ts"
Cohesion: 0.40
Nodes (4): DEFAULT_OPTIONS, DEFAULTS, InputmaskError, InputmaskValidationResult

### Community 190 - "Quick Links"
Cohesion: 0.40
Nodes (5): Detail Accounts Review Route, Document Review Route, General Accounts Review Route, Quick Links, Temporary Documents Route

### Community 191 - "fake interceptor ts"
Cohesion: 0.67
Nodes (3): FAKE_PATHS, fakeInterceptor(), MOCK_BODY

### Community 192 - "modular merge ts"
Cohesion: 0.67
Nodes (3): isTranslationTree(), mergeTranslationTree(), TranslationTree

### Community 193 - "Demo Action Modal"
Cohesion: 0.50
Nodes (4): Closed Event, Confirmation Notice, Demo Action Modal, Primary Selected Event

### Community 194 - "More Filters Dropdown"
Cohesion: 0.50
Nodes (4): Filters Apply Event, Filters Reset Event, More Filters Dropdown, Visible Filter Controls

### Community 200 - "Donut Chart"
Cohesion: 0.67
Nodes (3): D3 Donut Chart Directive, Donut Chart, Donut Segments and Legend

### Community 201 - "Gauge Chart"
Cohesion: 0.67
Nodes (3): D3 Gauge Chart Directive, Gauge Chart, Gauge Segments and Legend

### Community 202 - "Progress Breakdown"
Cohesion: 0.67
Nodes (3): D3 Progress Breakdown Directive, Normalized Progress Items, Progress Breakdown

### Community 203 - "Waterfall Chart"
Cohesion: 0.67
Nodes (3): D3 Waterfall Chart Directive, Waterfall Chart, Waterfall Legend

### Community 204 - "Invalid Feedback"
Cohesion: 0.67
Nodes (3): Get Error Info, Get Validation Parameter Text, Invalid Feedback

### Community 205 - "Button with Indicator"
Cohesion: 0.67
Nodes (3): Button with Indicator, Handle Click, Loading Indicator

### Community 206 - "Row Actions Dropdown"
Cohesion: 0.67
Nodes (3): Row Actions, Row Actions Dropdown, Select Action

### Community 207 - "Hierarchy Tree"
Cohesion: 0.67
Nodes (3): Hierarchy Tree, Hierarchy Search Input Handler, Hierarchy Tree Host

### Community 208 - "Messenger Drawer"
Cohesion: 0.67
Nodes (3): Active Messenger Contact, Messenger Drawer, Velora Drawer Directive

### Community 209 - "Modal Template"
Cohesion: 0.67
Nodes (3): Modal Configuration, Modal Template, Projected Modal Content

## Knowledge Gaps
- **446 isolated node(s):** `ClassProviderRecord`, `APP_CONFIG_CONSTANTS`, `AppProvidersConfig`, `ITrustBadge`, `IApp` (+441 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **60 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `BaseDirective` connect `BaseDirective Module` to `StickyDirective Module`, `DropzoneDirective Module`, `DrawerDirective Module`, `SearchDirective Module`, `TinySliderDirective Module`, `MaxlengthDirective Module`, `AutocompleteDirective Module`, `directive helpers ts`, `CookieAlertDirective Module`, `SingleOptionDirective Module`, `StepperDirective Module`, `TagifyDirective Module`, `runSafely Module`, `setOptionIfChanged Module`, `fullcalendar directive ts`, `logger service ts`, `ScrollDirective Module`, `InputmaskDirective Module`, `directive host ts`, `FullCalendarDirective Module`, `TreeDirective Module`, `autocomplete directive ts`, `ClipboardDirective Module`, `menu directive ts`, `FlatpickrDirective Module`, `MenuDirective Module`, `NoUiSliderDirective Module`, `autosize directive ts`, `DraggableDirective Module`, `CountUpDirective Module`, `AutosizeDirective Module`, `ImageInputDirective Module`, `IfIsBrowserDirective Module`, `ScrollTopDirective Module`, `ToggleDirective Module`, `inputmask directive ts`, `SwapperDirective Module`, `PasswordMeterDirective Module`, `DialerDirective Module`, `TypedDirective Module`, `AntiAutocompleteDirective Module`, `base directive spec ts`, `tree directive ts`, `cookie alert directive ts`?**
  _High betweenness centrality (0.195) - this node is a cross-community bridge._
- **Why does `LoggerService` connect `LoggerService Module` to `StickyDirective Module`, `DropzoneDirective Module`, `DrawerDirective Module`, `SearchDirective Module`, `TinySliderDirective Module`, `showContextMenu Module`, `format date ts`, `MaxlengthDirective Module`, `error Module`, `AutocompleteDirective Module`, `directive helpers ts`, `CookieAlertDirective Module`, `destroyPopperInst Module`, `SingleOptionDirective Module`, `StepperDirective Module`, `TagifyDirective Module`, `setOptionIfChanged Module`, `fullcalendar directive ts`, `logger service ts`, `layout service ts`, `tokens index ts`, `inputmask directive spec ts`, `ScrollDirective Module`, `warn Module`, `InputmaskDirective Module`, `velora icon component ts`, `directive host ts`, `FullCalendarDirective Module`, `autocomplete directive ts`, `ClipboardDirective Module`, `language initializer ts`, `menu directive ts`, `FlatpickrDirective Module`, `NoUiSliderDirective Module`, `TranslationService Module`, `autosize directive ts`, `DraggableDirective Module`, `CountUpDirective Module`, `AutosizeDirective Module`, `ImageInputDirective Module`, `IfIsBrowserDirective Module`, `ScrollTopDirective Module`, `ToggleDirective Module`, `error types ts`, `inputmask directive ts`, `utils index ts`, `SwapperDirective Module`, `PasswordMeterDirective Module`, `DialerDirective Module`, `ThemeModeService Module`, `auth service ts`, `TypedDirective Module`, `classic component ts`, `sidebar component ts`, `AntiAutocompleteDirective Module`, `base directive spec ts`, `tree directive ts`, `cookie alert directive ts`, `topbar component ts`?**
  _High betweenness centrality (0.127) - this node is a cross-community bridge._
- **Why does `runSafely()` connect `runSafely Module` to `StickyDirective Module`, `DropzoneDirective Module`, `DrawerDirective Module`, `SearchDirective Module`, `TinySliderDirective Module`, `MaxlengthDirective Module`, `AutocompleteDirective Module`, `directive helpers ts`, `CookieAlertDirective Module`, `SingleOptionDirective Module`, `TagifyDirective Module`, `setOptionIfChanged Module`, `LoggerService Module`, `logger service ts`, `layout service ts`, `fullcalendar directive ts`, `ScrollDirective Module`, `InputmaskDirective Module`, `loadTreeData Module`, `directive host ts`, `FullCalendarDirective Module`, `autocomplete directive ts`, `ClipboardDirective Module`, `menu directive ts`, `FlatpickrDirective Module`, `MenuDirective Module`, `NoUiSliderDirective Module`, `autosize directive ts`, `CountUpDirective Module`, `AutosizeDirective Module`, `ImageInputDirective Module`, `AuthService Module`, `inputmask directive ts`, `SwapperDirective Module`, `LayoutService Module`, `auth service ts`, `TypedDirective Module`, `tree directive ts`, `cookie alert directive ts`, `getItemTriggerValue Module`, `handleTouchEnd Module`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **Are the 34 inferred relationships involving `LoggerService` (e.g. with `languageDirectionSetup()` and `swCheckForUpdate()`) actually correct?**
  _`LoggerService` has 34 INFERRED edges - model-reasoned connections that need verification._
- **What connects `ClassProviderRecord`, `APP_CONFIG_CONSTANTS`, `AppProvidersConfig` to the rest of the system?**
  _446 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `StickyDirective Module` be split into smaller, more focused modules?**
  _Cohesion score 0.06436487638533675 - nodes in this community are weakly interconnected._
- **Should `DropzoneDirective Module` be split into smaller, more focused modules?**
  _Cohesion score 0.052917232021709636 - nodes in this community are weakly interconnected._