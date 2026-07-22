import {
  computed,
  Directive,
  effect,
  inject,
  input,
  OnChanges,
  OnDestroy,
  OnInit,
  output,
  signal,
  SimpleChanges,
  untracked,
} from '@angular/core';
import { LoggerService } from '@core/services/logger.service';
import { BaseDirective } from './shared/base-directive';
import { useDirectiveHost } from './shared/directive-host';
import { runSafely } from './shared/directive-helpers';

export interface TreeNode {
  id?: string;
  text: string;
  icon?: string;
  state?: {
    opened?: boolean;
    disabled?: boolean;
    selected?: boolean;
    loaded?: boolean;
    checked?: boolean;
    undetermined?: boolean;
  };
  children?: TreeNode[];
  data?: any;
  type?: string;
  parent?: string;
  li_attr?: { [key: string]: any };
  a_attr?: { [key: string]: any };
}

export interface TreeOptions {
  core?: {
    data?:
      | TreeNode[]
      | ((node: TreeNode, callback: (data: TreeNode[]) => void) => void);
    check_callback?:
      | boolean
      | ((
          operation: string,
          node: TreeNode,
          parent: TreeNode | null,
          position: number,
          more: TreeCheckCallbackContext
        ) => boolean);
    error?: (error: any) => void;
    animation?: boolean | number;
    multiple?: boolean;
    themes?: {
      name?: string;
      dots?: boolean;
      icons?: boolean;
      striped?: boolean;
    };
    force_text?: boolean;
    expand_selected_onload?: boolean;
    worker?: boolean;
    strings?: {
      loading?: string;
      new_node?: string;
      multiple_selection?: string;
    };
  };
  checkbox?: {
    three_state?: boolean;
    cascade?: string;
    tie_selection?: boolean;
    whole_node?: boolean;
    keep_selected_style?: boolean;
  };
  search?: {
    case_insensitive?: boolean;
    show_only_matches?: boolean;
    fuzzy?: boolean;
    ajax?: boolean;
    search_leaves_only?: boolean;
    search_callback?: (query: string, node: TreeNode) => boolean;
  };
  dnd?: {
    copy?: boolean;
    inside_pos?: string;
    check_while_dragging?: boolean;
    use_html5?: boolean;
    touch?: boolean;
    large_drop_target?: boolean;
    large_drag_target?: boolean;
    drag_selection?: boolean;
  };
  contextmenu?: {
    items?: (node: TreeNode) => any;
    select_node?: boolean;
    show_at_node?: boolean;
  };
  state?: {
    key?: string;
    events?: string[];
    ttl?: number;
    filter?: (state: any) => any;
    storage?: any;
  };
  types?: {
    [key: string]: {
      max_children?: number;
      max_depth?: number;
      valid_children?: string[];
      icon?: string;
      li_attr?: { [key: string]: any };
      a_attr?: { [key: string]: any };
    };
  };
  unique?: {
    duplicate?: (name: string, counter: number) => string;
    case_sensitive?: boolean;
  };
  wholerow?: {
    hover?: boolean;
    selected?: boolean;
  };
  massload?: {
    url?: string;
    data?: (node: TreeNode) => any;
  };
  sort?: boolean | ((a: TreeNode, b: TreeNode) => number);
  plugins?: string[];
}

export interface TreeCheckCallbackContext {
  is_copy: boolean;
  ref: TreeNode | null;
}

export interface TreeError {
  message: string;
  code: string;
  details?: any;
}

export interface TreeValidationResult {
  isValid: boolean;
  errors: TreeError[];
}

interface TreeInstance {
  container: HTMLElement;
  options: TreeOptions;
  nodes: Map<string, TreeNode>;
  selectedNodes: Set<string>;
  expandedNodes: Set<string>;
  _id: number;
}

type ContextMenuClickOutsideHandler = (event: MouseEvent) => void;
type TreeContextMenuElement = HTMLElement & {
  _clickOutsideHandler?: ContextMenuClickOutsideHandler;
};

export const setContextMenuClickOutsideHandler = (
  element: HTMLElement,
  handler: ContextMenuClickOutsideHandler
): void => {
  (element as TreeContextMenuElement)._clickOutsideHandler = handler;
};

export const getContextMenuClickOutsideHandler = (
  element: HTMLElement
): ContextMenuClickOutsideHandler | undefined =>
  (element as TreeContextMenuElement)._clickOutsideHandler;

type DropPosition = 'inside' | 'before' | 'after' | 'root';

interface DropLocation {
  parentNode: TreeNode | null;
  insertCollection: TreeNode[];
  insertIndex: number;
  targetNode: TreeNode | null;
  dropPosition: DropPosition;
}

@Directive({
  selector: '[vlVeloraTree]',
  exportAs: 'vlVeloraTree',
  standalone: true,
})
export class TreeDirective
  extends BaseDirective<TreeOptions, TreeError>
  implements OnInit, OnChanges, OnDestroy
{
  private readonly host = useDirectiveHost();

  constructor() {
    super(inject(LoggerService), 'TreeDirective', {});
    this.host.destroyRef.onDestroy(() => this.cleanup());
    this.initInputEffects();
  }

  private initInputEffects(): void {
    effect(() => {
      const data = this.treeData();
      untracked(() => {
        this.currentTreeData = data || [];
        if (this.isBaseInitialized()) this.loadTreeData();
      });
    });

    const createNestedEffect = <T>(
      inputFn: () => T | undefined,
      path: string
    ) => {
      effect(() => {
        const v = inputFn();
        untracked(() => {
          if (v !== undefined) this.setNestedOption(path, v);
        });
      });
    };

    createNestedEffect(this.treeAnimation, 'core.animation');
    createNestedEffect(this.treeMultiple, 'core.multiple');
    createNestedEffect(this.treeTheme, 'core.themes.name');
    createNestedEffect(this.treeDots, 'core.themes.dots');
    createNestedEffect(this.treeIcons, 'core.themes.icons');
    createNestedEffect(this.treeStriped, 'core.themes.striped');
    createNestedEffect(this.treeForceText, 'core.force_text');
    createNestedEffect(
      this.treeExpandSelectedOnload,
      'core.expand_selected_onload'
    );
    createNestedEffect(this.treeWorker, 'core.worker');
    createNestedEffect(this.treeCheckboxThreeState, 'checkbox.three_state');
    createNestedEffect(this.treeCheckboxCascade, 'checkbox.cascade');
    createNestedEffect(this.treeCheckboxTieSelection, 'checkbox.tie_selection');
    createNestedEffect(this.treeCheckboxWholeNode, 'checkbox.whole_node');
    createNestedEffect(
      this.treeSearchCaseInsensitive,
      'search.case_insensitive'
    );
    createNestedEffect(
      this.treeSearchShowOnlyMatches,
      'search.show_only_matches'
    );
    createNestedEffect(this.treeSearchFuzzy, 'search.fuzzy');
    createNestedEffect(this.treeDndCopy, 'dnd.copy');
    createNestedEffect(this.treeDndInsidePos, 'dnd.inside_pos');
    createNestedEffect(
      this.treeDndCheckWhileDragging,
      'dnd.check_while_dragging'
    );
    createNestedEffect(this.treeDndUseHtml5, 'dnd.use_html5');
    createNestedEffect(this.treeDndTouch, 'dnd.touch');
    createNestedEffect(this.treeMassloadUrl, 'massload.url');
    createNestedEffect(this.treeStateKey, 'state.key');
    createNestedEffect(this.treeStateEvents, 'state.events');
    createNestedEffect(this.treeStateTtl, 'state.ttl');
    createNestedEffect(this.treeSort, 'sort');
    createNestedEffect(this.treeUniqueCaseSensitive, 'unique.case_sensitive');
    createNestedEffect(this.treeTypes, 'types');

    effect(() => {
      const v = this.treePlugins();
      untracked(() => {
        if (v !== undefined) this.setNestedOption('plugins', v || []);
      });
    });

    effect(() => {
      const v = this.treeWholerow();
      untracked(() => {
        if (v !== undefined)
          this.setNestedOption('wholerow', { hover: v, selected: v });
      });
    });

    effect(() => {
      const v = this.treeUnique();
      untracked(() => {
        if (v !== undefined)
          this.setNestedOption('unique', { case_sensitive: !v });
      });
    });
  }

  // ============================================================================
  // SIGNALS & COMPUTED VALUES
  // ============================================================================

  // Signals for reactive state management
  private readonly _selectedNodes = signal<string[]>([]);
  private readonly _expandedNodes = signal<string[]>([]);
  private readonly _searchQuery = signal<string>('');
  private readonly _validationResult = signal<TreeValidationResult>({
    isValid: true,
    errors: [],
  });

  // Computed properties
  readonly isActive = this.status.isActive;
  readonly isLoading = this.status.isLoading;
  readonly error = this.status.error;
  readonly selectedNodes = computed(() => this._selectedNodes());
  readonly expandedNodes = computed(() => this._expandedNodes());
  readonly searchQuery = computed(() => this._searchQuery());
  readonly validationResult = computed(() => this._validationResult());

  // Tree instance
  private treeInstance: TreeInstance | null = null;
  private currentTreeData: TreeNode[] = [];
  private contextMenu: HTMLElement | null = null;
  private touchEventCleanups: Array<() => void> = [];
  private dragPlaceholder: HTMLElement | null = null;

  // Drag & Drop state
  private dragState: {
    isDragging: boolean;
    draggedNode: TreeNode | null;
    dragHelper: HTMLElement | null;
    dragHelperBadge: HTMLElement | null;
    dragHelperLabel: HTMLElement | null;
    dropTarget: HTMLElement | null;
    dropPosition: DropPosition;
    dragStartPosition: { x: number; y: number };
    originParentId: string | null;
    originIndex: number;
    isCopy: boolean;
  } = {
    isDragging: false,
    draggedNode: null,
    dragHelper: null,
    dragHelperBadge: null,
    dragHelperLabel: null,
    dropTarget: null,
    dropPosition: 'inside',
    dragStartPosition: { x: 0, y: 0 },
    originParentId: null,
    originIndex: -1,
    isCopy: false,
  };

  // Default options
  private readonly DEFAULT_OPTIONS: TreeOptions = {
    core: {
      animation: true,
      multiple: true,
      themes: {
        name: 'default',
        dots: true,
        icons: true,
        striped: false,
      },
      force_text: false,
      expand_selected_onload: false,
      worker: false,
    },
    checkbox: {
      three_state: false,
      cascade: 'up+down',
      tie_selection: false,
      whole_node: false,
      keep_selected_style: false,
    },
    search: {
      case_insensitive: true,
      show_only_matches: false,
      fuzzy: false,
      ajax: false,
      search_leaves_only: false,
    },
    dnd: {
      copy: false,
      inside_pos: 'last',
      check_while_dragging: true,
      use_html5: true,
      touch: true,
      large_drop_target: false,
      large_drag_target: false,
      drag_selection: false,
    },
    contextmenu: {
      select_node: true,
      show_at_node: true,
    },
    state: {
      key: 'jstree',
      events: ['changed.jstree', 'open_node.jstree', 'close_node.jstree'],
      ttl: 7200,
    },
    types: {},
    unique: {
      case_sensitive: false,
    },
    wholerow: {
      hover: false,
      selected: false,
    },
    massload: {},
    sort: false,
    plugins: [
      'checkbox',
      'contextmenu',
      'dnd',
      'search',
      'sort',
      'state',
      'types',
      'unique',
      'wholerow',
    ],
  };

  // Input properties (Signal-based)
  readonly treeData = input<TreeNode[]>([]);
  readonly treeAnimation = input<boolean | number>();
  readonly treeMultiple = input<boolean>();
  readonly treeTheme = input<string>();
  readonly treeDots = input<boolean>();
  readonly treeIcons = input<boolean>();
  readonly treeStriped = input<boolean>();
  readonly treeForceText = input<boolean>();
  readonly treeExpandSelectedOnload = input<boolean>();
  readonly treeWorker = input<boolean>();
  readonly treePlugins = input<string[] | null>();
  readonly treeCheckboxThreeState = input<boolean>();
  readonly treeCheckboxCascade = input<string>();
  readonly treeCheckboxTieSelection = input<boolean>();
  readonly treeCheckboxWholeNode = input<boolean>();
  readonly treeSearchCaseInsensitive = input<boolean>();
  readonly treeSearchShowOnlyMatches = input<boolean>();
  readonly treeSearchFuzzy = input<boolean>();
  readonly treeDndCopy = input<boolean>();
  readonly treeDndInsidePos = input<string>();
  readonly treeDndCheckWhileDragging = input<boolean>();
  readonly treeDndUseHtml5 = input<boolean>();
  readonly treeDndTouch = input<boolean>();
  readonly treeWholerow = input<boolean>();
  readonly treeMassloadUrl = input<string>();
  readonly treeStateKey = input<string>();
  readonly treeStateEvents = input<string[]>();
  readonly treeStateTtl = input<number>();
  readonly treeSort = input<boolean | ((a: TreeNode, b: TreeNode) => number)>();
  readonly treeUnique = input<boolean>();
  readonly treeUniqueCaseSensitive = input<boolean>();
  readonly treeTypes = input<{ [key: string]: any }>();

  // Output events (Signal-based)
  readonly readyEvent = output<void>();
  readonly createNodeEvent = output<{
    node: TreeNode;
    parent: TreeNode | null;
    position: number;
  }>();
  readonly moveNodeEvent = output<{
    node: TreeNode;
    parent: TreeNode | null;
    position: number;
  }>();
  readonly copyNodeEvent = output<{
    node: TreeNode;
    parent: TreeNode | null;
    position: number;
  }>();
  readonly renameNodeEvent = output<{
    node: TreeNode;
    oldName: string;
    newName: string;
  }>();
  readonly deleteNodeEvent = output<{
    node: TreeNode;
    parent: TreeNode | null;
  }>();
  readonly selectNodeEvent = output<{ node: TreeNode; selected: TreeNode[] }>();
  readonly deselectNodeEvent = output<{
    node: TreeNode;
    selected: TreeNode[];
  }>();
  readonly openNodeEvent = output<{ node: TreeNode }>();
  readonly closeNodeEvent = output<{ node: TreeNode }>();
  readonly loadNodeEvent = output<{ node: TreeNode }>();
  readonly searchEvent = output<{ query: string; nodes: TreeNode[] }>();
  readonly clearSearchEvent = output<void>();
  readonly showContextMenuEvent = output<{
    node: TreeNode;
    x: number;
    y: number;
  }>();
  readonly hideContextMenuEvent = output<void>();
  readonly beforeSelectEvent = output<{
    node: TreeNode;
    selected: TreeNode[];
  }>();
  readonly beforeOpenEvent = output<{ node: TreeNode }>();
  readonly beforeCloseEvent = output<{ node: TreeNode }>();
  readonly beforeLoadEvent = output<{ node: TreeNode }>();
  readonly beforeCreateEvent = output<{
    node: TreeNode;
    parent: TreeNode | null;
    position: number;
  }>();
  readonly beforeMoveEvent = output<{
    node: TreeNode;
    parent: TreeNode;
    position: number;
  }>();
  readonly beforeCopyEvent = output<{
    node: TreeNode;
    parent: TreeNode;
    position: number;
  }>();
  readonly beforeRenameEvent = output<{
    node: TreeNode;
    oldName: string;
    newName: string;
  }>();
  readonly beforeDeleteEvent = output<{
    node: TreeNode;
    parent: TreeNode | null;
  }>();
  readonly beforeSearchEvent = output<{ query: string }>();
  readonly checkNodeEvent = output<{
    node: TreeNode;
    checked: boolean;
    selected: TreeNode[];
  }>();
  readonly uncheckNodeEvent = output<{
    node: TreeNode;
    checked: boolean;
    selected: TreeNode[];
  }>();
  readonly checkAllEvent = output<{ checked: boolean; selected: TreeNode[] }>();
  readonly uncheckAllEvent = output<{
    checked: boolean;
    selected: TreeNode[];
  }>();
  readonly errorEvent = output<TreeError>();
  readonly validationChangeEvent = output<TreeValidationResult>();

  ngOnInit(): void {
    if (!this.host.isBrowser) {
      return;
    }

    this.initializeTree();
  }

  ngOnChanges(_changes: SimpleChanges): void {
    if (this.isBaseInitialized()) {
      this.loadTreeData();
    }
  }

  ngOnDestroy(): void {
    this.destroyTree();
    this.hideContextMenu();
  }

  private cleanup(): void {
    this.destroyTree();
    this.hideContextMenu();
  }

  private initializeTree(): void {
    this.status.setLoading(true);
    this.status.setError(null);

    const initialized = runSafely(
      () => {
        this.createTreeInstance();
        this.loadTreeData();
        this.setupEventListeners();
        this.setupDragAndDrop();
        return true;
      },
      (error) =>
        this.handleError('Failed to initialize tree', 'INIT_ERROR', error)
    );

    if (!initialized) {
      return;
    }

    this.status.setActive(true);
    this.status.setLoading(false);
    this.readyEvent.emit();
  }

  private createTreeInstance(): void {
    this.treeInstance = {
      container: this.host.elementRef.nativeElement,
      options: { ...this.DEFAULT_OPTIONS },
      nodes: new Map(),
      selectedNodes: new Set(),
      expandedNodes: new Set(),
      _id: Math.floor(Math.random() * 1000000),
    };

    const host = this.treeInstance.container;
    this.host.renderer.addClass(host, 'jstree');
    this.host.renderer.addClass(host, 'jstree-default');
    this.syncContainerClasses();

    this.markBaseInitialized();
  }

  private loadTreeData(): void {
    if (!this.treeInstance || !this.currentTreeData) return;

    const loaded = runSafely(
      () => {
        if (this.host.isBrowser) {
          this.host.renderer.setProperty(
            this.treeInstance!.container,
            'innerHTML',
            ''
          );
        }

        this.treeInstance!.nodes.clear();
        this.treeInstance!.selectedNodes.clear();
        this.treeInstance!.expandedNodes.clear();

        this.processNodes(this.currentTreeData!);
        this.renderTreeNodes(
          this.currentTreeData!,
          this.treeInstance!.container,
          1
        );

        this.treeInstance!.nodes.forEach((storedNode) => {
          if (!storedNode.id) {
            return;
          }
          this.updateNodeDisplay(storedNode.id);
          if (storedNode.state?.checked || storedNode.state?.undetermined) {
            this.updateCheckboxDisplay(storedNode.id);
          }
        });
        this.updateTabIndices();
        this.updateSelectedNodes();
        this.updateExpandedNodes();
        return true;
      },
      (error) =>
        this.handleError('Failed to load tree data', 'LOAD_ERROR', error)
    );

    if (!loaded) {
      return;
    }
  }

  private processNodes(nodes: TreeNode[], parentId?: string): void {
    nodes.forEach((node, index) => {
      // Generate ID if not provided
      if (!node.id) {
        node.id = `${parentId || 'root'}_${index}`;
      }

      // Set parent reference
      if (parentId) {
        node.parent = parentId;
      }

      // Initialize state if not provided
      if (!node.state) {
        node.state = {};
      }

      if (node.state.selected) {
        this.treeInstance!.selectedNodes.add(node.id);
      }

      if (node.state.opened) {
        this.treeInstance!.expandedNodes.add(node.id);
      }

      // Store node
      this.treeInstance!.nodes.set(node.id, node);

      // Process children
      if (node.children && node.children.length > 0) {
        this.processNodes(node.children, node.id);
      }
    });
  }

  private renderTreeNodes(
    nodes: TreeNode[],
    container: HTMLElement,
    level: number
  ): void {
    const ul = this.host.renderer.createElement('ul');
    this.host.renderer.addClass(ul, 'jstree-children');

    if (container === this.treeInstance?.container) {
      this.host.renderer.addClass(ul, 'jstree-container-ul');
      this.host.renderer.setAttribute(ul, 'role', 'tree');
    } else {
      this.host.renderer.setAttribute(ul, 'role', 'group');
    }

    nodes.forEach((node, index) => {
      const li = this.createNodeElement(
        node,
        level,
        index === nodes.length - 1
      );
      this.host.renderer.appendChild(ul, li);
    });

    this.host.renderer.appendChild(container, ul);
  }

  private createNodeElement(
    node: TreeNode,
    level: number,
    isLast: boolean
  ): HTMLElement {
    const li = this.host.renderer.createElement('li');
    this.host.renderer.setAttribute(li, 'data-node-id', node.id || '');
    this.host.renderer.addClass(li, 'jstree-node');
    this.host.renderer.setAttribute(li, 'role', 'treeitem');
    this.host.renderer.setAttribute(li, 'aria-level', String(level));
    const anchorId = `${node.id}_anchor`;
    this.host.renderer.setAttribute(li, 'aria-labelledby', anchorId);

    const hasChildren = !!(node.children && node.children.length > 0);
    const isOpened = !!node.state?.opened;

    if (hasChildren) {
      this.host.renderer.addClass(li, isOpened ? 'jstree-open' : 'jstree-closed');
      this.host.renderer.setAttribute(
        li,
        'aria-expanded',
        isOpened ? 'true' : 'false'
      );
    } else {
      this.host.renderer.addClass(li, 'jstree-leaf');
      this.host.renderer.setAttribute(li, 'aria-expanded', 'false');
    }

    if (node.state?.disabled) {
      this.host.renderer.addClass(li, 'jstree-disabled');
    }

    if (isLast) {
      this.host.renderer.addClass(li, 'jstree-last');
    }

    if (node.li_attr) {
      Object.entries(node.li_attr).forEach(([attr, value]) => {
        if (value !== undefined && value !== null) {
          this.host.renderer.setAttribute(li, attr, String(value));
        }
      });
    }

    const toggleIcon = this.host.renderer.createElement('i');
    this.host.renderer.addClass(toggleIcon, 'jstree-icon');
    this.host.renderer.addClass(toggleIcon, 'jstree-ocl');
    this.host.renderer.setAttribute(toggleIcon, 'role', 'presentation');
    this.host.renderer.appendChild(li, toggleIcon);

    if (
      this.treeInstance!.options.wholerow &&
      (this.treeInstance!.options.wholerow.hover ||
        this.treeInstance!.options.wholerow.selected)
    ) {
      const wholerow = this.host.renderer.createElement('i');
      this.host.renderer.addClass(wholerow, 'jstree-icon');
      this.host.renderer.addClass(wholerow, 'jstree-wholerow');
      this.host.renderer.appendChild(li, wholerow);
    }

    const anchor = this.host.renderer.createElement('a');
    this.host.renderer.addClass(anchor, 'jstree-anchor');
    this.host.renderer.setAttribute(anchor, 'href', '#');
    this.host.renderer.setAttribute(anchor, 'tabindex', '-1');
    this.host.renderer.setAttribute(
      anchor,
      'aria-selected',
      node.state?.selected ? 'true' : 'false'
    );
    this.host.renderer.setAttribute(anchor, 'id', anchorId);

    if (node.a_attr) {
      Object.entries(node.a_attr).forEach(([attr, value]) => {
        if (value !== undefined && value !== null) {
          this.host.renderer.setAttribute(anchor, attr, String(value));
        }
      });
    }

    if (this.treeInstance!.selectedNodes.has(node.id || '')) {
      this.host.renderer.addClass(anchor, 'jstree-clicked');
    }

    if (this.treeInstance!.options.plugins?.includes('checkbox')) {
      const checkbox = this.host.renderer.createElement('i');
      this.host.renderer.addClass(checkbox, 'jstree-icon');
      this.host.renderer.addClass(checkbox, 'jstree-checkbox');
      this.host.renderer.setAttribute(checkbox, 'role', 'presentation');
      this.host.renderer.appendChild(anchor, checkbox);
    }

    const icon = this.host.renderer.createElement('i');
    this.host.renderer.addClass(icon, 'jstree-icon');
    this.host.renderer.addClass(icon, 'jstree-themeicon');
    if (node.icon) {
      if (node.icon.startsWith('http') || node.icon.startsWith('data:')) {
        this.host.renderer.setStyle(icon, 'background-image', `url(${node.icon})`);
        this.host.renderer.setStyle(icon, 'background-position', 'center center');
        this.host.renderer.setStyle(icon, 'background-size', 'contain');
      } else {
        this.host.renderer.addClass(icon, node.icon);
      }
    }
    this.host.renderer.appendChild(anchor, icon);

    const text = this.host.renderer.createElement('span');
    this.host.renderer.addClass(text, 'jstree-text');
    this.host.renderer.addClass(text, 'jstree-anchor-text');
    this.host.renderer.setProperty(text, 'textContent', node.text);
    this.host.renderer.appendChild(anchor, text);
    this.host.renderer.appendChild(li, anchor);

    if (hasChildren) {
      const childrenContainer = this.host.renderer.createElement('ul');
      this.host.renderer.addClass(childrenContainer, 'jstree-children');
      this.host.renderer.setAttribute(childrenContainer, 'role', 'group');
      if (!isOpened) {
        this.host.renderer.setStyle(childrenContainer, 'display', 'none');
      }
      this.host.renderer.appendChild(li, childrenContainer);
      this.renderTreeNodes(node.children!, childrenContainer, level + 1);
    }

    return li;
  }

  private setupEventListeners(): void {
    if (!this.treeInstance) return;

    this.host.renderer.listen(
      this.treeInstance.container,
      'click',
      (event: Event) => {
        if (!this.host.isBrowser) return;

        const target = event.target as HTMLElement;

        // Handle expand/collapse
        if (target.classList.contains('jstree-ocl')) {
          event.preventDefault();
          event.stopPropagation();
          const nodeId = target
            .closest('[data-node-id]')
            ?.getAttribute('data-node-id');
          if (nodeId) {
            this.handleNodeToggle(nodeId);
          }
          return;
        }

        // Handle checkbox clicks
        if (target.classList.contains('jstree-checkbox')) {
          event.preventDefault();
          event.stopPropagation();
          const nodeId = target
            .closest('[data-node-id]')
            ?.getAttribute('data-node-id');
          if (nodeId) {
            this.handleCheckboxClick(nodeId);
          }
          return;
        }

        // Handle node selection
        if (
          target.classList.contains('jstree-anchor') ||
          target.classList.contains('jstree-text')
        ) {
          event.preventDefault();
          const nodeId = target
            .closest('[data-node-id]')
            ?.getAttribute('data-node-id');
          if (nodeId) {
            this.handleNodeSelection(nodeId, event);
          }
          return;
        }
      }
    );

    // Handle double-click for inline editing
    this.host.renderer.listen(
      this.treeInstance.container,
      'dblclick',
      (event: Event) => {
        if (!this.host.isBrowser) return;

        const target = event.target as HTMLElement;
        if (target.classList.contains('jstree-text')) {
          event.preventDefault();
          event.stopPropagation();
          const nodeId = target
            .closest('[data-node-id]')
            ?.getAttribute('data-node-id');
          if (nodeId) {
            this.startInlineEdit(nodeId);
          }
        }
      }
    );

    // Handle context menu
    this.host.renderer.listen(
      this.treeInstance.container,
      'contextmenu',
      (event: MouseEvent) => {
        event.preventDefault();
        const target = event.target as HTMLElement;
        const nodeId = target
          .closest('[data-node-id]')
          ?.getAttribute('data-node-id');
        if (nodeId) {
          this.handleContextMenu(nodeId, event.clientX, event.clientY);
        }
      }
    );

    // Handle keyboard navigation
    this.host.renderer.listen(
      this.treeInstance.container,
      'keydown',
      (event: KeyboardEvent) => {
        this.handleKeyboardNavigation(event);
      }
    );

    // Handle drag and drop events
    this.host.renderer.listen(
      this.treeInstance.container,
      'mousedown',
      (event: MouseEvent) => {
        this.handleMouseDown(event);
      }
    );

    this.host.renderer.listen(this.host.document, 'mousemove', (event: MouseEvent) => {
      this.handleDragMove(event);
    });

    this.host.renderer.listen(this.host.document, 'mouseup', (event: MouseEvent) => {
      this.handleDragEnd(event);
    });

    const touchStartHandler = (event: TouchEvent) => {
      this.handleTouchStart(event);
    };
    const touchMoveHandler = (event: TouchEvent) => {
      this.handleTouchMove(event);
    };
    const touchEndHandler = (event: TouchEvent) => {
      this.handleTouchEnd(event);
    };

    this.treeInstance.container.addEventListener(
      'touchstart',
      touchStartHandler,
      { passive: false }
    );
    this.touchEventCleanups.push(() => {
      this.treeInstance!.container.removeEventListener(
        'touchstart',
        touchStartHandler
      );
    });

    this.host.document.addEventListener('touchmove', touchMoveHandler, {
      passive: false,
    });
    this.touchEventCleanups.push(() => {
      this.host.document.removeEventListener('touchmove', touchMoveHandler);
    });

    this.host.document.addEventListener('touchend', touchEndHandler, {
      passive: true,
    });
    this.touchEventCleanups.push(() => {
      this.host.document.removeEventListener('touchend', touchEndHandler);
    });
  }

  private handleNodeToggle(nodeId: string): void {
    const node = this.treeInstance?.nodes.get(nodeId);
    if (!node || !node.children) return;

    const isExpanded = node.state?.opened || false;
    const newState = !isExpanded;

    // Update node state
    node.state = { ...node.state, opened: newState };

    // Update expanded nodes set
    if (this.treeInstance) {
      if (newState) {
        this.treeInstance.expandedNodes.add(nodeId);
        this.openNodeEvent.emit({ node });
      } else {
        this.treeInstance.expandedNodes.delete(nodeId);
        this.closeNodeEvent.emit({ node });
      }
    }

    // Update UI
    this.updateNodeDisplay(nodeId);
    this.updateExpandedNodes();
  }

  private handleCheckboxClick(nodeId: string): void {
    const node = this.treeInstance?.nodes.get(nodeId);
    if (!node) return;

    const isChecked = node.state?.checked || false;
    const newChecked = !isChecked;

    // Update node state
    if (!node.state) node.state = {};
    node.state.checked = newChecked;
    node.state.undetermined = false;

    // Update checkbox display
    this.updateCheckboxDisplay(nodeId);

    // Handle cascade
    if (this.treeInstance?.options.checkbox?.cascade) {
      this.handleCheckboxCascade(nodeId, newChecked);
    }

    // Emit event
    if (newChecked) {
      this.checkNodeEvent.emit({
        node,
        checked: true,
        selected: Array.from(this.treeInstance!.selectedNodes)
          .map((id) => this.treeInstance!.nodes.get(id))
          .filter(Boolean) as TreeNode[],
      });
    } else {
      this.uncheckNodeEvent.emit({
        node,
        checked: false,
        selected: Array.from(this.treeInstance!.selectedNodes)
          .map((id) => this.treeInstance!.nodes.get(id))
          .filter(Boolean) as TreeNode[],
      });
    }
  }

  private handleCheckboxCascade(nodeId: string, checked: boolean): void {
    const node = this.treeInstance?.nodes.get(nodeId);
    if (!node) return;

    const cascade = this.treeInstance?.options.checkbox?.cascade || 'up+down';

    // Cascade down to children
    if (cascade.includes('down') && node.children) {
      node.children.forEach((child: TreeNode) => {
        if (child.id) {
          if (!child.state) child.state = {};
          child.state.checked = checked;
          child.state.undetermined = false;
          this.updateCheckboxDisplay(child.id);
          this.handleCheckboxCascade(child.id, checked);
        }
      });
    }

    // Cascade up to parents
    if (cascade.includes('up') && node.parent) {
      const parent = this.treeInstance?.nodes.get(node.parent);
      if (parent) {
        this.updateParentCheckboxState(parent.id!);
      }
    }
  }

  private updateParentCheckboxState(parentId: string): void {
    const parent = this.treeInstance?.nodes.get(parentId);
    if (!parent || !parent.children) return;

    const children = parent.children.filter((child) => child.id);
    const checkedChildren = children.filter((child) => child.state?.checked);
    const undeterminedChildren = children.filter(
      (child) => child.state?.undetermined
    );

    if (!parent.state) parent.state = {};

    if (checkedChildren.length === children.length) {
      parent.state.checked = true;
      parent.state.undetermined = false;
    } else if (checkedChildren.length > 0 || undeterminedChildren.length > 0) {
      parent.state.checked = false;
      parent.state.undetermined = true;
    } else {
      parent.state.checked = false;
      parent.state.undetermined = false;
    }

    this.updateCheckboxDisplay(parentId);

    // Cascade up to grandparent
    if (parent.parent) {
      this.updateParentCheckboxState(parent.parent);
    }
  }

  private updateCheckboxDisplay(nodeId: string): void {
    const nodeElement = this.treeInstance?.container.querySelector(
      `[data-node-id="${nodeId}"]`
    );
    if (!nodeElement) return;

    const checkbox = nodeElement.querySelector('.jstree-checkbox');
    if (!checkbox) return;

    const node = this.treeInstance?.nodes.get(nodeId);
    if (!node) return;

    // Remove existing classes
    this.host.renderer.removeClass(checkbox, 'jstree-checked');
    this.host.renderer.removeClass(checkbox, 'jstree-undetermined');

    // Add appropriate class
    if (node.state?.checked) {
      this.host.renderer.addClass(checkbox, 'jstree-checked');
    } else if (node.state?.undetermined) {
      this.host.renderer.addClass(checkbox, 'jstree-undetermined');
    }
  }

  private handleNodeSelection(nodeId: string, event: Event): void {
    const node = this.treeInstance?.nodes.get(nodeId);
    if (!node || !this.treeInstance) return;

    const isSelected = this.treeInstance.selectedNodes.has(nodeId);

    if (isSelected) {
      this.treeInstance.selectedNodes.delete(nodeId);
      this.deselectNodeEvent.emit({
        node,
        selected: Array.from(this.treeInstance.selectedNodes)
          .map((id) => this.treeInstance!.nodes.get(id))
          .filter(Boolean) as TreeNode[],
      });
    } else {
      if (!this.treeInstance.options.core?.multiple) {
        this.treeInstance.selectedNodes.clear();
      }
      this.treeInstance.selectedNodes.add(nodeId);
      this.selectNodeEvent.emit({
        node,
        selected: Array.from(this.treeInstance.selectedNodes)
          .map((id) => this.treeInstance!.nodes.get(id))
          .filter(Boolean) as TreeNode[],
      });
    }

    this.updateSelectedNodes();
    this.updateNodeDisplay(nodeId);
    this.updateTabIndices();

    // Focus selected anchor for accessible keyboard navigation
    const nodeElement = this.treeInstance?.container.querySelector<HTMLElement>(
      `[data-node-id="${nodeId}"]`
    );
    const anchor = nodeElement?.querySelector<HTMLElement>('.jstree-anchor');
    if (anchor) {
      this.host.renderer.setAttribute(anchor, 'tabindex', '0');
      anchor.focus({ preventScroll: true });
    }
  }

  private handleContextMenu(nodeId: string, x: number, y: number): void {
    const node = this.treeInstance?.nodes.get(nodeId);
    if (!node) return;

    // Hide any existing context menu first
    this.hideContextMenu();

    this.showContextMenuEvent.emit({ node, x, y });
    this.showContextMenu(node, x, y);
  }

  private showContextMenu(node: TreeNode, x: number, y: number): void {
    this.hideContextMenu();

    this.contextMenu = this.host.renderer.createElement('div');
    this.host.renderer.addClass(this.contextMenu, 'jstree-context-menu');
    this.host.renderer.setStyle(this.contextMenu, 'position', 'fixed');
    this.host.renderer.setStyle(this.contextMenu, 'left', `${x}px`);
    this.host.renderer.setStyle(this.contextMenu, 'top', `${y}px`);
    this.host.renderer.setStyle(this.contextMenu, 'z-index', '10000');

    // Add menu items
    this.addContextMenuItem('Rename', () => this.startInlineEdit(node.id!));
    this.addContextMenuItem('Add Child', () => this.addChildNode(node.id!));
    this.addContextMenuSeparator();
    this.addContextMenuItem('Delete', () => this.deleteNode(node.id!));

    this.host.renderer.appendChild(this.host.document.body, this.contextMenu);

    // Add click outside handler to close context menu
    const handleClickOutside = (event: MouseEvent) => {
      if (
        this.contextMenu &&
        !this.contextMenu.contains(event.target as Node)
      ) {
        this.hideContextMenu();
      }
    };

    // Add the click outside listener
    setTimeout(() => {
      this.host.document.addEventListener('click', handleClickOutside);
    }, 0);

    // Store the handler for cleanup
    if (this.contextMenu) {
      setContextMenuClickOutsideHandler(this.contextMenu, handleClickOutside);
    }
  }

  private hideContextMenu(): void {
    if (this.contextMenu) {
      // Clean up click outside handler
      const clickOutsideHandler = getContextMenuClickOutsideHandler(
        this.contextMenu
      );
      if (clickOutsideHandler) {
        this.host.document.removeEventListener('click', clickOutsideHandler);
      }

      this.host.renderer.removeChild(this.host.document.body, this.contextMenu);
      this.contextMenu = null;
      this.hideContextMenuEvent.emit();
    }
  }

  private addContextMenuItem(text: string, action: () => void): void {
    if (!this.contextMenu) return;

    const item = this.host.renderer.createElement('div');
    this.host.renderer.addClass(item, 'context-menu-item');
    this.host.renderer.setProperty(item, 'textContent', text);

    this.host.renderer.listen(item, 'click', () => {
      action();
      this.hideContextMenu();
    });

    this.host.renderer.appendChild(this.contextMenu, item);
  }

  private addContextMenuSeparator(): void {
    if (!this.contextMenu) return;

    const separator = this.host.renderer.createElement('div');
    this.host.renderer.addClass(separator, 'context-menu-separator');
    this.host.renderer.appendChild(this.contextMenu, separator);
  }

  private handleKeyboardNavigation(event: KeyboardEvent): void {
    if (!this.host.isBrowser) return;

    const target = event.target as HTMLElement;
    if (!target.classList.contains('jstree-anchor')) return;

    const nodeId = target
      .closest('[data-node-id]')
      ?.getAttribute('data-node-id');
    if (!nodeId) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.navigateToNextNode(nodeId);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.navigateToPreviousNode(nodeId);
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (!this.treeInstance?.nodes.get(nodeId)?.state?.opened) {
          this.handleNodeToggle(nodeId);
        }
        break;
      case 'ArrowLeft':
        event.preventDefault();
        if (this.treeInstance?.nodes.get(nodeId)?.state?.opened) {
          this.handleNodeToggle(nodeId);
        }
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.handleNodeSelection(nodeId, event);
        break;
    }
  }

  private navigateToNextNode(currentNodeId: string): void {
    // Implementation for finding next node in tree order
    const allNodes = Array.from(this.treeInstance?.nodes.keys() || []);
    const currentIndex = allNodes.indexOf(currentNodeId);
    if (currentIndex < allNodes.length - 1) {
      const nextNodeId = allNodes[currentIndex + 1];
      this.focusNode(nextNodeId);
    }
  }

  private navigateToPreviousNode(currentNodeId: string): void {
    // Implementation for finding previous node in tree order
    const allNodes = Array.from(this.treeInstance?.nodes.keys() || []);
    const currentIndex = allNodes.indexOf(currentNodeId);
    if (currentIndex > 0) {
      const prevNodeId = allNodes[currentIndex - 1];
      this.focusNode(prevNodeId);
    }
  }

  private focusNode(nodeId: string): void {
    const nodeElement = this.treeInstance?.container.querySelector(
      `[data-node-id="${nodeId}"] .jstree-anchor`
    );
    if (nodeElement) {
      (nodeElement as HTMLElement).focus();
    }
  }

  private setupDragAndDrop(): void {
    // Drag and drop is handled in event listeners
  }

  private initializeDragOrigin(node: TreeNode): void {
    const parentId = node.parent ?? null;
    this.dragState.originParentId = parentId;
    this.dragState.originIndex = this.getNodeIndex(node);
  }

  private getNodeIndex(node: TreeNode): number {
    const parentId = node.parent ?? null;
    if (!parentId) {
      return this.currentTreeData.findIndex((child) => child.id === node.id);
    }

    const parentNode = this.treeInstance?.nodes.get(parentId);
    if (!parentNode || !parentNode.children) {
      return -1;
    }
    return parentNode.children.findIndex((child) => child.id === node.id);
  }

  private shouldCopy(event: MouseEvent | null): boolean {
    if (!event || !this.treeInstance?.options.dnd?.copy) {
      return false;
    }
    return Boolean(event.altKey || event.ctrlKey || event.metaKey);
  }

  private updateDragHelperMode(): void {
    if (!this.dragState.dragHelper) {
      return;
    }

    this.host.renderer.setAttribute(
      this.dragState.dragHelper,
      'data-mode',
      this.dragState.isCopy ? 'copy' : 'move'
    );

    if (this.dragState.dragHelperBadge) {
      this.host.renderer.setProperty(
        this.dragState.dragHelperBadge,
        'textContent',
        this.dragState.isCopy ? 'Copy' : 'Move'
      );
    }
  }

  private getCollectionByParentId(parentId: string | null): TreeNode[] {
    if (!parentId) {
      return this.currentTreeData;
    }

    const parentNode = this.treeInstance?.nodes.get(parentId);
    if (!parentNode) {
      return this.currentTreeData;
    }

    parentNode.children = parentNode.children ?? [];
    return parentNode.children;
  }

  private getInsideInsertIndex(parentNode: TreeNode | null): number {
    const collection = parentNode
      ? parentNode.children ?? []
      : this.currentTreeData;
    const insidePos = (
      this.treeInstance?.options.dnd?.inside_pos ?? 'last'
    ).toString();

    switch (insidePos) {
      case 'first':
      case 'before':
        return 0;
      case 'after':
      case 'last':
      default:
        return collection.length;
    }
  }

  private cloneNode(node: TreeNode, parentId: string | null = null): TreeNode {
    const cloneId = this.generateNodeId(node.id ?? 'node');
    const clonedChildren = node.children?.map((child) =>
      this.cloneNode(child, cloneId)
    );

    return {
      ...node,
      id: cloneId,
      parent: parentId ?? undefined,
      state: node.state ? { ...node.state, selected: false } : undefined,
      children: clonedChildren,
    };
  }

  private generateNodeId(baseId: string): string {
    const sanitized = baseId.replace(/[^a-zA-Z0-9_-]/g, '') || 'node';
    let candidate: string;
    do {
      candidate = `${sanitized}_${Math.random().toString(36).slice(2, 10)}`;
    } while (this.nodeExists(candidate));
    return candidate;
  }

  private nodeExists(id: string): boolean {
    if (this.treeInstance?.nodes.has(id)) {
      return true;
    }
    return this.findNodeById(id, this.currentTreeData) !== null;
  }

  private findNodeById(id: string, nodes: TreeNode[]): TreeNode | null {
    for (const node of nodes) {
      if (node.id === id) {
        return node;
      }
      if (node.children) {
        const found = this.findNodeById(id, node.children);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  private isOperationAllowed(
    operation: 'move_node' | 'copy_node',
    node: TreeNode,
    parent: TreeNode | null,
    position: number
  ): boolean {
    const checkCallback = this.treeInstance?.options.core?.check_callback;

    if (typeof checkCallback === 'boolean') {
      return checkCallback;
    }

    if (typeof checkCallback === 'function') {
      const result = runSafely(
        () =>
          checkCallback(operation, node, parent, position, {
            is_copy: operation === 'copy_node',
            ref: parent ?? null,
          }),
        (error) =>
          this.logger.error('check_callback threw an error', 'TreeDirective', {
            error,
          })
      );
      return result ?? false;
    }

    return true;
  }

  private computeDropLocation(
    draggedNode: TreeNode,
    dropTarget: HTMLElement | null,
    dropPosition: DropPosition,
    isCopy: boolean
  ): DropLocation | null {
    if (!this.treeInstance) {
      return null;
    }

    const targetNodeId = dropTarget?.getAttribute('data-node-id') ?? null;
    const targetNode = targetNodeId
      ? this.treeInstance.nodes.get(targetNodeId) ?? null
      : null;

    if (targetNode?.state?.disabled) {
      return null;
    }

    if (!isCopy) {
      if (
        targetNode &&
        (targetNode.id === draggedNode.id ||
          this.isDescendant(targetNode.id!, draggedNode.id!))
      ) {
        return null;
      }
    } else if (
      targetNode &&
      targetNode.id === draggedNode.id &&
      dropPosition === 'inside'
    ) {
      return null;
    }

    let parentNode: TreeNode | null = null;
    let insertCollection: TreeNode[];
    let insertIndex = 0;

    switch (dropPosition) {
      case 'inside': {
        if (!targetNode) {
          parentNode = null;
          insertCollection = this.currentTreeData;
        } else {
          parentNode = targetNode;
          parentNode.children = parentNode.children ?? [];
          insertCollection = parentNode.children;
        }
        insertIndex = this.getInsideInsertIndex(parentNode);
        break;
      }
      case 'before':
      case 'after': {
        if (!targetNode) {
          return null;
        }
        parentNode = targetNode.parent
          ? this.treeInstance.nodes.get(targetNode.parent) ?? null
          : null;
        const collection = this.getCollectionByParentId(parentNode?.id ?? null);
        const targetIndex = collection.findIndex(
          (node) => node.id === targetNode.id
        );
        if (targetIndex === -1) {
          return null;
        }
        insertCollection = collection;
        insertIndex = dropPosition === 'before' ? targetIndex : targetIndex + 1;
        break;
      }
      case 'root':
      default: {
        parentNode = null;
        insertCollection = this.currentTreeData;
        insertIndex = insertCollection.length;
        break;
      }
    }

    if (!isCopy) {
      const originParentId = this.dragState.originParentId;
      const originIndex = this.dragState.originIndex;
      const destinationParentId = parentNode ? parentNode.id ?? null : null;

      if (originParentId === destinationParentId && originIndex !== -1) {
        const originCollection = this.getCollectionByParentId(originParentId);
        if (
          originCollection === insertCollection &&
          insertIndex > originIndex
        ) {
          insertIndex -= 1;
        }
      }
    }

    return {
      parentNode,
      insertCollection,
      insertIndex,
      targetNode,
      dropPosition,
    };
  }

  private handleMouseDown(event: MouseEvent): void {
    if (event.button !== 0) return; // Only left mouse button

    const target = event.target as HTMLElement;
    const nodeId = target
      .closest('[data-node-id]')
      ?.getAttribute('data-node-id');
    if (!nodeId) return;

    const node = this.treeInstance?.nodes.get(nodeId);
    if (!node || node.state?.disabled) return;

    this.initializeDragOrigin(node);
    this.dragState.dragStartPosition = { x: event.clientX, y: event.clientY };
    this.dragState.draggedNode = node;
    this.dragState.isCopy = this.shouldCopy(event);
    this.dragState.dropTarget = null;
    this.dragState.dropPosition = 'inside';
  }

  private handleDragMove(event: MouseEvent): void {
    if (!this.dragState.draggedNode) {
      return;
    }

    const deltaX = Math.abs(event.clientX - this.dragState.dragStartPosition.x);
    const deltaY = Math.abs(event.clientY - this.dragState.dragStartPosition.y);

    if (!this.dragState.isDragging && (deltaX > 5 || deltaY > 5)) {
      this.startDrag(event);
    }

    if (this.dragState.isDragging) {
      event.preventDefault();
      const copyIntent = this.shouldCopy(event);
      if (copyIntent !== this.dragState.isCopy) {
        this.dragState.isCopy = copyIntent;
        this.updateDragHelperMode();
      }
      this.updateDragHelperPosition(event.clientX, event.clientY);
      this.updateDropTarget(event.clientX, event.clientY);
    } else if (event.buttons === 0) {
      this.resetDragState();
    }
  }

  private handleDragEnd(event: MouseEvent): void {
    if (this.dragState.isDragging && this.dragState.draggedNode) {
      const dropTarget = this.dragState.dropTarget;
      if (
        dropTarget &&
        this.canDrop(
          this.dragState.draggedNode,
          dropTarget,
          this.dragState.dropPosition
        )
      ) {
        this.performDrop(this.dragState.draggedNode, dropTarget);
      }
    }

    this.clearDropTargets();
    this.removeDragHelper();
    this.removeDragPlaceholder();
    this.resetDragState();
  }

  private handleTouchStart(event: TouchEvent): void {
    if (event.touches.length !== 1) return;

    const touch = event.touches[0];
    const target = event.target as HTMLElement;
    const nodeId = target
      .closest('[data-node-id]')
      ?.getAttribute('data-node-id');
    if (!nodeId) return;

    const node = this.treeInstance?.nodes.get(nodeId);
    if (!node || node.state?.disabled) return;

    this.initializeDragOrigin(node);
    this.dragState.dragStartPosition = { x: touch.clientX, y: touch.clientY };
    this.dragState.draggedNode = node;
    this.dragState.isCopy = false;
    this.dragState.dropTarget = null;
    this.dragState.dropPosition = 'inside';
  }

  private handleTouchMove(event: TouchEvent): void {
    if (!this.dragState.draggedNode || event.touches.length !== 1) return;

    const touch = event.touches[0];
    const deltaX = Math.abs(touch.clientX - this.dragState.dragStartPosition.x);
    const deltaY = Math.abs(touch.clientY - this.dragState.dragStartPosition.y);

    if (!this.dragState.isDragging && (deltaX > 5 || deltaY > 5)) {
      this.startDrag(touch);
    }

    if (this.dragState.isDragging) {
      event.preventDefault();
      this.updateDragHelperPosition(touch.clientX, touch.clientY);
      this.updateDropTarget(touch.clientX, touch.clientY);
    }
  }

  private handleTouchEnd(event: TouchEvent): void {
    if (this.dragState.isDragging && this.dragState.draggedNode) {
      const dropTarget = this.dragState.dropTarget;
      if (
        dropTarget &&
        this.canDrop(
          this.dragState.draggedNode,
          dropTarget,
          this.dragState.dropPosition
        )
      ) {
        const touch = event.changedTouches[0];
        this.updateDragHelperPosition(touch.clientX, touch.clientY);
        this.performDrop(this.dragState.draggedNode, dropTarget);
      }
    }

    this.clearDropTargets();
    this.removeDragHelper();
    this.removeDragPlaceholder();
    this.resetDragState();
  }

  private startDrag(event: MouseEvent | Touch): void {
    if (!this.dragState.draggedNode) return;

    this.dragState.isDragging = true;
    this.dragState.isCopy =
      event instanceof MouseEvent ? this.shouldCopy(event) : false;
    this.dragState.dragHelper = this.createDragHelper();
    this.updateDragHelperMode();
    this.ensureDragPlaceholder();
    this.updateDragHelperPosition(event.clientX, event.clientY);
    this.host.renderer.addClass(this.host.document.body, 'jstree-dnd-active');
  }

  private resetDragState(): void {
    this.host.renderer.removeClass(this.host.document.body, 'jstree-dnd-active');
    this.dragState.isDragging = false;
    this.dragState.draggedNode = null;
    this.dragState.dragHelper = null;
    this.dragState.dragHelperBadge = null;
    this.dragState.dragHelperLabel = null;
    this.dragState.dropTarget = null;
    this.dragState.dropPosition = 'inside';
    this.dragState.dragStartPosition = { x: 0, y: 0 };
    this.dragState.originParentId = null;
    this.dragState.originIndex = -1;
    this.dragState.isCopy = false;
    this.removeDragPlaceholder();
  }

  private createDragHelper(): HTMLElement {
    const helper = this.host.renderer.createElement('div');
    this.host.renderer.addClass(helper, 'jstree-dnd-helper');

    const badge = this.host.renderer.createElement('span');
    this.host.renderer.addClass(badge, 'jstree-dnd-badge');
    this.host.renderer.setProperty(
      badge,
      'textContent',
      this.dragState.isCopy ? 'Copy' : 'Move'
    );

    const label = this.host.renderer.createElement('span');
    this.host.renderer.addClass(label, 'jstree-dnd-label');
    this.host.renderer.setProperty(
      label,
      'textContent',
      this.dragState.draggedNode?.text || ''
    );

    this.host.renderer.appendChild(helper, badge);
    this.host.renderer.appendChild(helper, label);

    this.host.renderer.appendChild(this.host.document.body, helper);

    this.dragState.dragHelperBadge = badge;
    this.dragState.dragHelperLabel = label;

    this.host.renderer.setAttribute(
      helper,
      'data-mode',
      this.dragState.isCopy ? 'copy' : 'move'
    );
    this.host.renderer.setStyle(helper, 'left', '0px');
    this.host.renderer.setStyle(helper, 'top', '0px');

    return helper;
  }

  private updateDragHelperPosition(x: number, y: number): void {
    if (this.dragState.dragHelper) {
      this.host.renderer.setStyle(this.dragState.dragHelper, 'left', `${x + 14}px`);
      this.host.renderer.setStyle(this.dragState.dragHelper, 'top', `${y + 16}px`);
    }
  }

  private removeDragHelper(): void {
    if (this.dragState.dragHelper) {
      this.host.renderer.removeChild(this.host.document.body, this.dragState.dragHelper);
      this.dragState.dragHelper = null;
    }
    this.dragState.dragHelperBadge = null;
    this.dragState.dragHelperLabel = null;
  }

  private ensureDragPlaceholder(): HTMLElement {
    if (!this.dragPlaceholder) {
      const placeholder = this.host.renderer.createElement('div');
      this.host.renderer.addClass(placeholder, 'jstree-drag-placeholder');
      this.host.renderer.addClass(placeholder, 'is-hidden');
      this.dragPlaceholder = placeholder;
    }
    return this.dragPlaceholder as HTMLElement;
  }

  private placePlaceholderBefore(nodeElement: HTMLElement): void {
    const placeholder = this.ensureDragPlaceholder();
    const parent = nodeElement.parentElement;
    if (!parent) {
      return;
    }
    if (
      placeholder.parentElement !== parent ||
      placeholder.nextSibling !== nodeElement
    ) {
      this.host.renderer.insertBefore(parent, placeholder, nodeElement);
    }
    this.host.renderer.removeClass(placeholder, 'is-hidden');
  }

  private placePlaceholderAfter(nodeElement: HTMLElement): void {
    const placeholder = this.ensureDragPlaceholder();
    const parent = nodeElement.parentElement;
    if (!parent) {
      return;
    }
    const nextSibling = nodeElement.nextSibling;
    if (
      placeholder.parentElement !== parent ||
      placeholder.previousSibling !== nodeElement
    ) {
      if (nextSibling) {
        this.host.renderer.insertBefore(parent, placeholder, nextSibling);
      } else {
        this.host.renderer.appendChild(parent, placeholder);
      }
    }
    this.host.renderer.removeClass(placeholder, 'is-hidden');
  }

  private placePlaceholderAtRoot(): void {
    if (!this.treeInstance) {
      return;
    }
    const placeholder = this.ensureDragPlaceholder();
    const container = this.treeInstance.container.querySelector(
      ':scope > .jstree-children'
    );
    if (container) {
      this.host.renderer.appendChild(container, placeholder);
    } else {
      this.host.renderer.appendChild(this.treeInstance.container, placeholder);
    }
    this.host.renderer.removeClass(placeholder, 'is-hidden');
  }

  private hideDragPlaceholder(): void {
    if (this.dragPlaceholder) {
      this.host.renderer.addClass(this.dragPlaceholder, 'is-hidden');
    }
  }

  private removeDragPlaceholder(): void {
    if (this.dragPlaceholder && this.dragPlaceholder.parentElement) {
      this.host.renderer.removeChild(
        this.dragPlaceholder.parentElement,
        this.dragPlaceholder
      );
    }
    this.dragPlaceholder = null;
  }

  private findDropTarget(x: number, y: number): HTMLElement | null {
    const element = this.host.document.elementFromPoint(x, y);
    if (!element) {
      return this.treeInstance?.container ?? null;
    }

    const nodeElement = element.closest('[data-node-id]');
    if (nodeElement) {
      return nodeElement as HTMLElement;
    }

    if (this.treeInstance?.container.contains(element)) {
      return this.treeInstance.container;
    }

    return null;
  }

  private updateDropTarget(x: number, y: number): void {
    this.clearDropTargets();
    if (!this.dragState.draggedNode) {
      return;
    }

    const dropElement = this.findDropTarget(x, y);
    const placeholder = this.ensureDragPlaceholder();
    let dropTarget: HTMLElement | null = null;
    let dropPosition: DropPosition = 'inside';

    if (dropElement && dropElement !== this.treeInstance?.container) {
      const nodeId = dropElement.getAttribute('data-node-id');
      if (nodeId) {
        const rect = dropElement.getBoundingClientRect();
        const offsetY = y - rect.top;
        const threshold = rect.height * 0.25;

        if (offsetY < threshold) {
          dropPosition = 'before';
          this.placePlaceholderBefore(dropElement);
        } else if (offsetY > rect.height - threshold) {
          dropPosition = 'after';
          this.placePlaceholderAfter(dropElement);
        } else {
          dropPosition = 'inside';
          this.host.renderer.addClass(dropElement, 'jstree-drop-target');
          this.hideDragPlaceholder();
        }

        if (
          this.canDrop(this.dragState.draggedNode, dropElement, dropPosition)
        ) {
          dropTarget = dropElement;
        } else {
          this.hideDragPlaceholder();
          this.host.renderer.removeClass(dropElement, 'jstree-drop-target');
        }
      }
    }

    if (!dropTarget && !dropElement && this.treeInstance) {
      const container = this.treeInstance.container;
      dropPosition = 'root';
      this.placePlaceholderAtRoot();
      if (this.canDrop(this.dragState.draggedNode, container, dropPosition)) {
        dropTarget = container;
      } else {
        this.host.renderer.addClass(placeholder, 'is-hidden');
      }
    }

    if (dropTarget) {
      this.dragState.dropTarget = dropTarget;
      this.dragState.dropPosition = dropPosition;
    } else {
      this.dragState.dropTarget = null;
      this.dragState.dropPosition = 'inside';
      this.host.renderer.addClass(placeholder, 'is-hidden');
    }
  }

  private clearDropTargets(): void {
    const dropTargets = this.treeInstance?.container.querySelectorAll(
      '.jstree-drop-target'
    );
    dropTargets?.forEach((target) => {
      this.host.renderer.removeClass(target, 'jstree-drop-target');
    });
    this.hideDragPlaceholder();
  }

  private canDrop(
    draggedNode: TreeNode,
    dropTarget: HTMLElement,
    dropPosition: DropPosition
  ): boolean {
    if (!this.treeInstance) {
      return false;
    }

    const normalizedTarget =
      dropTarget === this.treeInstance.container ? null : dropTarget;
    const location = this.computeDropLocation(
      draggedNode,
      normalizedTarget,
      dropPosition,
      this.dragState.isCopy
    );

    if (!location) {
      return false;
    }

    const operation = this.dragState.isCopy ? 'copy_node' : 'move_node';
    return this.isOperationAllowed(
      operation,
      draggedNode,
      location.parentNode,
      location.insertIndex
    );
  }

  private isDescendant(nodeId: string, ancestorId: string): boolean {
    const node = this.treeInstance?.nodes.get(nodeId);
    if (!node) return false;

    if (node.parent === ancestorId) return true;
    if (node.parent) return this.isDescendant(node.parent, ancestorId);

    return false;
  }

  private performDrop(draggedNode: TreeNode, dropTarget: HTMLElement): void {
    if (!this.treeInstance) {
      return;
    }

    const location = this.computeDropLocation(
      draggedNode,
      dropTarget === this.treeInstance.container ? null : dropTarget,
      this.dragState.dropPosition,
      this.dragState.isCopy
    );

    if (!location) {
      return;
    }

    const { parentNode, insertCollection, insertIndex, dropPosition } =
      location;
    const allowCopy = Boolean(this.treeInstance.options.dnd?.copy);
    const isCopy = this.dragState.isCopy && allowCopy;
    const operation: 'move_node' | 'copy_node' = isCopy
      ? 'copy_node'
      : 'move_node';

    if (
      !this.isOperationAllowed(operation, draggedNode, parentNode, insertIndex)
    ) {
      this.logger.error('Drop rejected by check_callback', 'TreeDirective');
      return;
    }

    let workingNode: TreeNode;

    if (isCopy) {
      workingNode = this.cloneNode(draggedNode, parentNode?.id ?? null);
    } else {
      this.removeNodeFromParent(draggedNode.id!);
      workingNode = draggedNode;
      workingNode.parent = parentNode ? parentNode.id : undefined;
    }

    if (parentNode) {
      parentNode.children = parentNode.children ?? [];
    }

    insertCollection.splice(insertIndex, 0, workingNode);

    if (parentNode) {
      parentNode.children = insertCollection;
      parentNode.state = parentNode.state ?? {};
      if (dropPosition === 'inside') {
        parentNode.state.opened = true;
      }
    }

    if (!parentNode) {
      this.currentTreeData = insertCollection;
    }

    workingNode.parent = parentNode ? parentNode.id : undefined;

    this.refreshTree();

    if (isCopy) {
      this.copyNodeEvent.emit({
        node: workingNode,
        parent: parentNode ?? null,
        position: insertIndex,
      });
    } else {
      this.moveNodeEvent.emit({
        node: workingNode,
        parent: parentNode ?? null,
        position: insertIndex,
      });
    }
  }

  private removeNodeFromParent(nodeId: string): void {
    const node = this.treeInstance?.nodes.get(nodeId);
    if (!node) return;

    if (!node.parent) {
      const rootIndex = this.currentTreeData.findIndex(
        (child) => child.id === nodeId
      );
      if (rootIndex > -1) {
        this.currentTreeData.splice(rootIndex, 1);
      }
      return;
    }

    const parent = this.treeInstance?.nodes.get(node.parent);
    if (!parent || !parent.children) return;

    const index = parent.children.findIndex((child) => child.id === nodeId);
    if (index > -1) {
      parent.children.splice(index, 1);
    }
  }

  private startInlineEdit(nodeId: string): void {
    const node = this.treeInstance?.nodes.get(nodeId);
    if (!node) return;

    const nodeElement = this.treeInstance?.container.querySelector(
      `[data-node-id="${nodeId}"]`
    );
    if (!nodeElement) return;

    const textElement = nodeElement.querySelector('.jstree-text');
    if (!textElement) return;

    // Store original text element for restoration
    const originalTextElement = textElement.cloneNode(true) as HTMLElement;

    // Create input element
    const input = this.host.renderer.createElement('input');
    this.host.renderer.setAttribute(input, 'type', 'text');
    this.host.renderer.setAttribute(input, 'value', node.text);
    this.host.renderer.addClass(input, 'jstree-rename-input');
    this.host.renderer.setStyle(input, 'border', '1px solid #007bff');
    this.host.renderer.setStyle(input, 'border-radius', '3px');
    this.host.renderer.setStyle(input, 'padding', '2px 4px');
    this.host.renderer.setStyle(input, 'font-size', '14px');
    this.host.renderer.setStyle(input, 'width', '100%');
    this.host.renderer.setStyle(input, 'outline', 'none');
    this.host.renderer.setStyle(input, 'background', 'white');
    this.host.renderer.setStyle(input, 'color', '#495057');

    // Replace text with input
    this.host.renderer.insertBefore(textElement.parentElement!, input, textElement);
    this.host.renderer.removeChild(textElement.parentElement!, textElement);

    // Focus and select text
    setTimeout(() => {
      input.focus();
      input.select();
    }, 0);

    // Handle input events
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        event.stopPropagation();
        this.finishInlineEdit(nodeId, input.value);
      } else if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        this.cancelInlineEdit(nodeId, originalTextElement);
      }
      // Allow normal typing for other keys
    };

    const handleBlur = (event: FocusEvent) => {
      // Don't prevent default for blur - we want normal blur behavior
      this.finishInlineEdit(nodeId, input.value);
    };

    const handleClick = (event: MouseEvent) => {
      // Don't prevent default for click - we want normal input behavior
      event.stopPropagation(); // Only stop propagation to prevent tree events
    };

    // Add event listeners
    this.host.renderer.listen(input, 'keydown', handleKeydown);
    this.host.renderer.listen(input, 'blur', handleBlur);
    this.host.renderer.listen(input, 'click', handleClick);
  }

  private finishInlineEdit(nodeId: string, newText: string): void {
    const node = this.treeInstance?.nodes.get(nodeId);
    if (!node) return;

    const oldText = node.text;
    const trimmedText = newText.trim();

    // Only update if text actually changed
    if (trimmedText && trimmedText !== oldText) {
      node.text = trimmedText;
    }

    // Restore text element
    const nodeElement = this.treeInstance?.container.querySelector(
      `[data-node-id="${nodeId}"]`
    );
    if (nodeElement) {
      const input = nodeElement.querySelector('.jstree-rename-input');
      if (input) {
        const textElement = this.host.renderer.createElement('span');
        this.host.renderer.addClass(textElement, 'jstree-text');
        this.host.renderer.addClass(textElement, 'jstree-anchor-text');
        this.host.renderer.setProperty(textElement, 'textContent', node.text);

        this.host.renderer.insertBefore(input.parentElement!, textElement, input);
        this.host.renderer.removeChild(input.parentElement!, input);
      }
    }

    // Emit rename event only if text changed
    if (trimmedText && trimmedText !== oldText) {
      this.renameNodeEvent.emit({
        node,
        oldName: oldText,
        newName: trimmedText,
      });
    }

    this.updateTabIndices();
  }

  private cancelInlineEdit(
    nodeId: string,
    originalTextElement: HTMLElement
  ): void {
    const nodeElement = this.treeInstance?.container.querySelector(
      `[data-node-id="${nodeId}"]`
    );
    if (nodeElement) {
      const input = nodeElement.querySelector('.jstree-rename-input');
      if (input) {
        // Restore the original text element
        this.host.renderer.insertBefore(
          input.parentElement!,
          originalTextElement,
          input
        );
        this.host.renderer.removeChild(input.parentElement!, input);
      }
    }
  }

  private addChildNode(parentId: string): void {
    const parent = this.treeInstance?.nodes.get(parentId);
    if (!parent) return;

    const newNode: TreeNode = {
      id: `${parentId}_${Date.now()}`,
      text: 'New Node',
      state: { opened: false, selected: false, checked: false },
    };

    if (!parent.children) {
      parent.children = [];
    }
    parent.children.push(newNode);
    newNode.parent = parentId;

    // Store node
    this.treeInstance!.nodes.set(newNode.id!, newNode);

    // Expand parent
    if (!parent.state) parent.state = {};
    parent.state.opened = true;

    // Refresh tree
    this.refreshTree();

    // Emit create event
    this.createNodeEvent.emit({
      node: newNode,
      parent,
      position: parent.children.length - 1,
    });
  }

  private deleteNode(nodeId: string): void {
    const node = this.treeInstance?.nodes.get(nodeId);
    if (!node) return;

    const parent = node.parent
      ? this.treeInstance?.nodes.get(node.parent)
      : null;

    // Remove from parent
    if (parent && parent.children) {
      const index = parent.children.findIndex((child) => child.id === nodeId);
      if (index > -1) {
        parent.children.splice(index, 1);
      }
    }

    // Remove from nodes map
    this.treeInstance!.nodes.delete(nodeId);

    // Refresh tree
    this.refreshTree();

    // Emit delete event
    this.deleteNodeEvent.emit({
      node,
      parent: parent || null,
    });
  }

  private updateNodeDisplay(nodeId: string): void {
    const nodeElement = this.treeInstance?.container.querySelector(
      `[data-node-id="${nodeId}"]`
    );
    if (!nodeElement) return;

    const node = this.treeInstance?.nodes.get(nodeId);
    if (!node) return;

    const anchor = nodeElement.querySelector(
      '.jstree-anchor'
    ) as HTMLElement | null;
    const childrenContainer = nodeElement.querySelector(
      ':scope > .jstree-children'
    ) as HTMLElement | null;

    // Update selected state
    if (this.treeInstance?.selectedNodes.has(nodeId)) {
      this.host.renderer.addClass(nodeElement, 'jstree-selected');
      if (anchor) {
        this.host.renderer.addClass(anchor, 'jstree-clicked');
        this.host.renderer.setAttribute(anchor, 'aria-selected', 'true');
      }
    } else {
      this.host.renderer.removeClass(nodeElement, 'jstree-selected');
      if (anchor) {
        this.host.renderer.removeClass(anchor, 'jstree-clicked');
        this.host.renderer.setAttribute(anchor, 'aria-selected', 'false');
      }
    }

    const hasChildren = !!(node.children && node.children.length > 0);

    if (!hasChildren) {
      this.host.renderer.addClass(nodeElement, 'jstree-leaf');
      this.host.renderer.removeClass(nodeElement, 'jstree-open');
      this.host.renderer.removeClass(nodeElement, 'jstree-closed');
      this.host.renderer.setAttribute(nodeElement, 'aria-expanded', 'false');
      if (childrenContainer) {
        this.host.renderer.setStyle(childrenContainer, 'display', 'none');
      }
      return;
    }

    if (node.state?.opened) {
      this.host.renderer.addClass(nodeElement, 'jstree-open');
      this.host.renderer.removeClass(nodeElement, 'jstree-closed');
      this.host.renderer.setAttribute(nodeElement, 'aria-expanded', 'true');
      if (childrenContainer) {
        this.host.renderer.removeStyle(childrenContainer, 'display');
      }
    } else {
      this.host.renderer.addClass(nodeElement, 'jstree-closed');
      this.host.renderer.removeClass(nodeElement, 'jstree-open');
      this.host.renderer.setAttribute(nodeElement, 'aria-expanded', 'false');
      if (childrenContainer) {
        this.host.renderer.setStyle(childrenContainer, 'display', 'none');
      }
    }
  }

  private updateSelectedNodes(): void {
    if (this.treeInstance) {
      this._selectedNodes.set(Array.from(this.treeInstance.selectedNodes));
    }
  }

  private updateExpandedNodes(): void {
    if (this.treeInstance) {
      this._expandedNodes.set(Array.from(this.treeInstance.expandedNodes));
    }
  }

  private setNestedOption(key: string, value: any): boolean {
    if (!this.treeInstance) return false;

    const keys = key.split('.');
    let current: any = this.treeInstance.options;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }

    const leafKey = keys[keys.length - 1];
    const prev = current[leafKey];
    if (prev === value) {
      return false;
    }
    current[leafKey] = value;
    this.syncContainerClasses();
    this.updateTabIndices();
    return true;
  }

  private updateTabIndices(): void {
    if (!this.treeInstance) {
      return;
    }

    const anchors = Array.from(
      this.treeInstance.container.querySelectorAll<HTMLElement>(
        '.jstree-anchor'
      )
    );
    const selectedId = this.treeInstance.selectedNodes.values().next().value as
      | string
      | undefined;
    let focusSet = false;

    anchors.forEach((anchor) => {
      const parentNode = anchor.closest<HTMLElement>('[data-node-id]');
      const matchesSelection =
        selectedId && parentNode?.getAttribute('data-node-id') === selectedId;

      if (matchesSelection) {
        this.host.renderer.setAttribute(anchor, 'tabindex', '0');
        focusSet = true;
      } else {
        this.host.renderer.setAttribute(anchor, 'tabindex', '-1');
      }
    });

    if (!focusSet && anchors.length > 0) {
      this.host.renderer.setAttribute(anchors[0], 'tabindex', '0');
    }
  }

  private syncContainerClasses(): void {
    if (!this.treeInstance) {
      return;
    }

    const host = this.treeInstance.container;
    const plugins = this.treeInstance.options.plugins ?? [];

    if (plugins.includes('wholerow')) {
      this.host.renderer.addClass(host, 'jstree-wholerow');
    } else {
      this.host.renderer.removeClass(host, 'jstree-wholerow');
    }

    if (plugins.includes('checkbox')) {
      this.host.renderer.addClass(host, 'jstree-checkbox');
    } else {
      this.host.renderer.removeClass(host, 'jstree-checkbox');
    }

    const striped = this.treeInstance.options.core?.themes?.striped ?? false;
    if (striped) {
      this.host.renderer.addClass(host, 'jstree-striped');
    } else {
      this.host.renderer.removeClass(host, 'jstree-striped');
    }
  }

  private handleError(message: string, code: string, details?: any): void {
    const error: TreeError = {
      message,
      code,
      details,
    };

    this.status.setError(error);
    this.status.setLoading(false);
    this.errorEvent.emit(error);
    this.logger.error(message, 'TreeDirective', { code, details });
  }

  // Public API methods
  getOptions(): TreeOptions {
    return this.treeInstance?.options || this.DEFAULT_OPTIONS;
  }

  getSelectedNodes(): TreeNode[] {
    if (!this.treeInstance) return [];
    return Array.from(this.treeInstance.selectedNodes)
      .map((id) => this.treeInstance!.nodes.get(id))
      .filter(Boolean) as TreeNode[];
  }

  getExpandedNodes(): string[] {
    return this.treeInstance ? Array.from(this.treeInstance.expandedNodes) : [];
  }

  getSearchQuery(): string {
    return this._searchQuery();
  }

  getValidationResult(): TreeValidationResult {
    return this._validationResult();
  }

  selectNode(nodeId: string): void {
    if (this.treeInstance && this.treeInstance.nodes.has(nodeId)) {
      this.treeInstance.selectedNodes.add(nodeId);
      this.updateSelectedNodes();
    }
  }

  deselectNode(nodeId: string): void {
    if (this.treeInstance) {
      this.treeInstance.selectedNodes.delete(nodeId);
      this.updateSelectedNodes();
    }
  }

  selectAll(): void {
    if (this.treeInstance) {
      this.treeInstance.nodes.forEach((node: TreeNode, id: string) => {
        this.treeInstance!.selectedNodes.add(id);
      });
      this.updateSelectedNodes();
    }
  }

  deselectAll(): void {
    if (this.treeInstance) {
      this.treeInstance.selectedNodes.clear();
      this.updateSelectedNodes();
    }
  }

  expandNode(nodeId: string): void {
    const node = this.treeInstance?.nodes.get(nodeId);
    if (node && node.children) {
      node.state = { ...node.state, opened: true };
      this.treeInstance!.expandedNodes.add(nodeId);
      this.updateExpandedNodes();
      this.refreshTree();
    }
  }

  collapseNode(nodeId: string): void {
    const node = this.treeInstance?.nodes.get(nodeId);
    if (node && node.children) {
      node.state = { ...node.state, opened: false };
      this.treeInstance!.expandedNodes.delete(nodeId);
      this.updateExpandedNodes();
      this.refreshTree();
    }
  }

  expandAll(): void {
    if (this.treeInstance) {
      this.treeInstance.nodes.forEach((node: TreeNode, id: string) => {
        if (node.children && node.children.length > 0) {
          node.state = { ...node.state, opened: true };
          this.treeInstance!.expandedNodes.add(id);
        }
      });
      this.updateExpandedNodes();
      this.refreshTree();
    }
  }

  collapseAll(): void {
    if (this.treeInstance) {
      this.treeInstance.expandedNodes.clear();
      this.treeInstance.nodes.forEach((node: TreeNode) => {
        if (node.state) {
          node.state.opened = false;
        }
      });
      this.updateExpandedNodes();
      this.refreshTree();
    }
  }

  search(query: string): void {
    this._searchQuery.set(query);
    // Implementation for search functionality
  }

  clearSearch(): void {
    this._searchQuery.set('');
    // Implementation for clearing search
  }

  addNode(node: TreeNode, parentId?: string): void {
    if (!this.treeInstance) return;

    // Generate ID if not provided
    if (!node.id) {
      node.id = `node_${Date.now()}`;
    }

    // Set parent
    if (parentId) {
      node.parent = parentId;
      const parent = this.treeInstance.nodes.get(parentId);
      if (parent) {
        if (!parent.children) parent.children = [];
        parent.children.push(node);
      }
    } else {
      this.currentTreeData.push(node);
    }

    // Store node
    this.treeInstance.nodes.set(node.id, node);

    // Refresh tree
    this.refreshTree();
  }

  removeNode(nodeId: string): void {
    this.deleteNode(nodeId);
  }

  updateNode(nodeId: string, updates: Partial<TreeNode>): void {
    const node = this.treeInstance?.nodes.get(nodeId);
    if (node) {
      Object.assign(node, updates);
      this.refreshTree();
    }
  }

  refreshTree(): void {
    if (this.treeInstance) {
      this.loadTreeData();
    }
  }

  recreateTree(): void {
    this.destroyTree();
    this.initializeTree();
  }

  destroyTree(): void {
    this.touchEventCleanups.forEach((cleanup) => cleanup());
    this.touchEventCleanups = [];
    this.removeDragPlaceholder();

    if (this.treeInstance) {
      if (this.host.isBrowser) {
        this.host.renderer.setProperty(this.treeInstance.container, 'innerHTML', '');
      }
      this.treeInstance = null;
      this.baseCleanup();
      this.status.setActive(false);
    }
  }

  isValidTree(): boolean {
    return this._validationResult().isValid;
  }

  getError(): TreeError | null {
    return this.status.getError();
  }

  // Checkbox API methods
  checkAll(): void {
    if (!this.treeInstance) return;
    this.treeInstance.nodes.forEach((node: TreeNode, nodeId: string) => {
      if (!node.state) node.state = {};
      node.state.checked = true;
      node.state.undetermined = false;
      this.updateCheckboxDisplay(nodeId);
    });
    this.checkAllEvent.emit({
      checked: true,
      selected: Array.from(this.treeInstance.selectedNodes)
        .map((id) => this.treeInstance!.nodes.get(id))
        .filter(Boolean) as TreeNode[],
    });
  }

  uncheckAll(): void {
    if (!this.treeInstance) return;
    this.treeInstance.nodes.forEach((node: TreeNode, nodeId: string) => {
      if (!node.state) node.state = {};
      node.state.checked = false;
      node.state.undetermined = false;
      this.updateCheckboxDisplay(nodeId);
    });
    this.uncheckAllEvent.emit({
      checked: false,
      selected: Array.from(this.treeInstance.selectedNodes)
        .map((id) => this.treeInstance!.nodes.get(id))
        .filter(Boolean) as TreeNode[],
    });
  }

  getCheckedNodes(): TreeNode[] {
    if (!this.treeInstance) return [];
    return Array.from(this.treeInstance.nodes.values()).filter(
      (node) => node.state?.checked
    ) as TreeNode[];
  }

  getUncheckedNodes(): TreeNode[] {
    if (!this.treeInstance) return [];
    return Array.from(this.treeInstance.nodes.values()).filter(
      (node) => !node.state?.checked
    ) as TreeNode[];
  }

  checkNode(nodeId: string): void {
    if (!this.treeInstance) return;
    const node = this.treeInstance.nodes.get(nodeId);
    if (!node) return;

    if (!node.state) node.state = {};
    node.state.checked = true;
    node.state.undetermined = false;
    this.updateCheckboxDisplay(nodeId);

    this.checkNodeEvent.emit({
      node,
      checked: true,
      selected: Array.from(this.treeInstance.selectedNodes)
        .map((id) => this.treeInstance!.nodes.get(id))
        .filter(Boolean) as TreeNode[],
    });
  }

  uncheckNode(nodeId: string): void {
    if (!this.treeInstance) return;
    const node = this.treeInstance.nodes.get(nodeId);
    if (!node) return;

    if (!node.state) node.state = {};
    node.state.checked = false;
    node.state.undetermined = false;
    this.updateCheckboxDisplay(nodeId);

    this.uncheckNodeEvent.emit({
      node,
      checked: false,
      selected: Array.from(this.treeInstance.selectedNodes)
        .map((id) => this.treeInstance!.nodes.get(id))
        .filter(Boolean) as TreeNode[],
    });
  }

  // Node navigation API methods
  getNode(nodeId: string): TreeNode | null {
    if (!this.treeInstance) return null;
    return this.treeInstance.nodes.get(nodeId) || null;
  }

  getParent(nodeId: string): TreeNode | null {
    const node = this.getNode(nodeId);
    if (!node || !node.parent) return null;
    return this.getNode(node.parent);
  }

  getChildren(nodeId: string): TreeNode[] {
    const node = this.getNode(nodeId);
    return node?.children || [];
  }

  getSiblingsNodes(nodeId: string): TreeNode[] {
    const parent = this.getParent(nodeId);
    if (!parent) return [];
    return parent.children?.filter((child) => child.id !== nodeId) || [];
  }

  getPath(nodeId: string): TreeNode[] {
    const path: TreeNode[] = [];
    let currentNode = this.getNode(nodeId);

    while (currentNode) {
      path.unshift(currentNode);
      currentNode = this.getParent(currentNode.id!);
    }

    return path;
  }

  // State checking API methods
  isChecked(nodeId: string): boolean {
    const node = this.getNode(nodeId);
    return node?.state?.checked || false;
  }

  isSelected(nodeId: string): boolean {
    if (!this.treeInstance) return false;
    return this.treeInstance.selectedNodes.has(nodeId);
  }

  isExpanded(nodeId: string): boolean {
    if (!this.treeInstance) return false;
    return this.treeInstance.expandedNodes.has(nodeId);
  }

  isDisabled(nodeId: string): boolean {
    const node = this.getNode(nodeId);
    return node?.state?.disabled || false;
  }
}
