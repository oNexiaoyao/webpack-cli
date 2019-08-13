/**
 * @file 对象选择器
 * @author 管超
 */

import { Event } from '../models/Event';
import { IDictionaryLite } from '../models/DictionaryLite';
import { IOrganization } from '../models/Organization';

/**
 * 对象容器 Id 前缀
 */
const ObjectContainerIdPrefix: string = 'osObjectList';

/**
 * 对象 Id 前缀
 */
const ObjectIdPrefix: string = 'osObject';

/**
 * 对象选择器组件
 */
export class ObjectSelector {
  /**
   * DOM 容器 Id
   */
  private _containerId: string;

  /**
   * 是否支持多选
   */
  private _multiple: boolean;

  /**
   * 标题
   */
  private _title: string;

  /**
   * 对象类别
   */
  private _categories: IDictionaryLite[];

  /**
   * 对象
   */
  private _objects: IOrganization[];

  /**
   * 默认选中的对象编码
   */
  private _defaultSelectedObjects: string[];

  /**
   * 选中的对象
   */
  private _selectedObjects: IOrganization[];

  /**
   * 容器 DOM
   */
  private _containerDOM: HTMLElement | null;

  /**
   * 按钮 DOM
   */
  private _btnGroupDOM: HTMLDivElement | null;

  /**
   * 标题 DOM
   */
  private _titleDOM: HTMLSpanElement | null;

  /**
   * 分类列表 DOM
   */
  private _categoryListDOM: HTMLUListElement | null;

  /**
   * 对象请求事件
   */
  private _evObjectRequest: Event = new Event('ObjectSelector-ObjectRequest');

  /**
   * 分类变更事件
   */
  private _evCategoryChange: Event = new Event('ObjectSelector-CategoryChange');

  /**
   * 对象变更事件
   */
  private _evObjectChange: Event = new Event('ObjectSelector-ObjectChange');

  /**
   * 创建对象选择器组件类型实例
   *
   * @param containerId - 容器 Id
   */
  public constructor(containerId: string) {
    this._containerId = containerId;
    this._containerDOM = document.getElementById(this._containerId);
    this._multiple = false;
    this._title = '请选择对象';
    this._categories = [];
    this._objects = [];
    this._defaultSelectedObjects = [];
    this._selectedObjects = [];

    this._handleCategoryMouseOverEvent = this._handleCategoryMouseOverEvent.bind(this);
    this._handleAllCategoryClickEvent = this._handleAllCategoryClickEvent.bind(this);
    this._handleObjectClickEvent = this._handleObjectClickEvent.bind(this);

    this._createDropdownButton();
  }

  /**
   * 多选
   */
  public get multiple(): boolean {
    return this._multiple;
  }

  /**
   * 多选
   */
  public set multiple(value: boolean) {
    if (this._multiple !== value) {
      this._multiple = value;

      if (this._btnGroupDOM) {
        this._btnGroupDOM.className = 'btn-group object-selector';

        if (this.multiple) {
          this._btnGroupDOM.className = `${this._btnGroupDOM.className} multiple`;
        }
      }
    }
  }

  /**
   * 缺省标题
   */
  public get title(): string {
    return this._title;
  }

  /**
   * 缺省标题
   */
  public set title(value: string) {
    if (this._title !== value) {
      this._title = value;

      if (this._titleDOM) {
        this._titleDOM.innerText = this.title;
      }
    }
  }

  /**
   * 类别
   */
  public set categories(value: IDictionaryLite[]) {
    this._categories = [...value];
    this._evCategoryChange.raise([...value]);

    // 清空对象数据
    this._objects = [];
    this._selectedObjects = [];
    // 重置标题
    this._resetTitle();
    this._createCategoryList();

    // 获取所有对象数据
    // if (this.multiple) {
    this._categories.forEach((item: IDictionaryLite): void => {
      this._evObjectRequest.raise(item.code);
    });
    // }
  }

  /**
   * 对象
   */
  public set objects(value: IOrganization[]) {
    if (value.length > 0) {
      // 查找分类
      const category: string = value[0].category;

      // 判断当前分类容器下是否存在子节点
      const objectList: HTMLUListElement =
        <HTMLUListElement>document.getElementById(`${ObjectContainerIdPrefix}-${this._containerId}-${category}`);

      // 如果容器下不存在子节点，将此对象列表添加进去
      if (objectList && !objectList.hasChildNodes()) {
        value.forEach((object: IOrganization): void => {
          const li: HTMLLIElement = document.createElement('li');
          const link: HTMLAnchorElement = document.createElement('a');
          link.id = `${ObjectIdPrefix}-${this._containerId}-${object.code}`;
          link.setAttribute('data-code', object.code);
          link.addEventListener('click', this._handleObjectClickEvent);
          const isDefault: boolean = !!this._defaultSelectedObjects.find((item: string): boolean => {
            return item === object.code;
          });
          if (isDefault) {
            link.className = 'selected';
            this._selectedObjects.push(object);
          }
          const text: HTMLSpanElement = document.createElement('span');
          text.innerText = object.name;
          const icon: HTMLSpanElement = document.createElement('span');
          icon.className = 'glyphicon glyphicon-ok';
          link.appendChild(text);
          link.appendChild(icon);
          li.appendChild(link);
          objectList.appendChild(li);
        });

        this._objects.push(...value);
      }

      this._resetTitle();
    }
  }

  /**
   * 默认选中对象编码
   */
  public set defaultSelectedObjects(value: string[]) {
    this._defaultSelectedObjects = [...value];
  }

  /**
   * 选中对象
   */
  public get selectedObjects(): IOrganization[] {
    return [...this._selectedObjects];
  }

  /**
   * 订阅对象请求事件
   *
   * @param handler
   */
  public subscribeObjectRequestEvent(handler: (category: string) => void): void {
    this._evObjectRequest.addHandler(handler);
  }

  /**
   * 取消订阅对象请求事件
   *
   * @param handler
   */
  public unsubscribeObjectRequestEvent(handler: (category: string) => void): void {
    this._evObjectRequest.removeHandler(handler);
  }

  /**
   * 订阅类别变更事件
   *
   * @param handler
   */
  public subscribeCategoryChangeEvent(handler: (categories: IDictionaryLite[]) => void): void {
    this._evCategoryChange.addHandler(handler);
  }

  /**
   * 取消订阅类别变更事件
   *
   * @param handler
   */
  public unsubscribeCategoryChangeEvent(handler: (categories: IDictionaryLite[]) => void): void {
    this._evCategoryChange.removeHandler(handler);
  }

  /**
   * 订阅对象变更事件
   *
   * @param handler
   */
  public subscribeObjectChangeEvent(handler: (objects: IOrganization[], checked: boolean) => void): void {
    this._evObjectChange.addHandler(handler);
  }

  /**
   * 取消订阅对象变更事件
   *
   * @param handler
   */
  public unsubscribeObjectChangeEvent(handler: (objects: IOrganization[]) => void, checked: boolean): void {
    this._evObjectChange.removeHandler(handler);
  }

  /**
   * 创建 Dropdown 按钮 DOM
   */
  private _createDropdownButton(): void {
    if (this._containerDOM) {
      this._btnGroupDOM = document.createElement('div');
      this._btnGroupDOM.className = 'btn-group object-selector';

      if (this.multiple) {
        this._btnGroupDOM.className = `${this._btnGroupDOM.className} multiple`;
      }

      const btn: HTMLButtonElement = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-default dropdown-toggle';
      btn.style.textAlign = 'right';
      btn.setAttribute('data-toggle', 'dropdown');
      btn.setAttribute('aria-haspopup', 'true');
      btn.setAttribute('arial-expanded', 'false');
      this._titleDOM = document.createElement('span');
      this._titleDOM.innerText = this.title;
      this._titleDOM.className = 'title';
      const caret: HTMLSpanElement = document.createElement('span');
      caret.className = 'caret';
      btn.appendChild(this._titleDOM);
      btn.appendChild(caret);
      this._btnGroupDOM.appendChild(btn);

      this._categoryListDOM = document.createElement('ul');
      this._categoryListDOM.className = 'dropdown-menu';
      this._btnGroupDOM.appendChild(this._categoryListDOM);

      this._containerDOM.appendChild(this._btnGroupDOM);
    }
  }

  /**
   * 创建分类列表 DOM
   */
  private _createCategoryList(): void {
    // 清空原始数据
    if (this._categoryListDOM) {
      while (this._categoryListDOM.hasChildNodes()) {
        const child: ChildNode | null = this._categoryListDOM.firstChild;
        if (child) {
          this._categoryListDOM.removeChild(child);
        }
      }
    }

    // 重新生成新的分类 DOM
    this._categories.forEach((category: IDictionaryLite): void => {
      const li: HTMLLIElement = document.createElement('li');
      const link: HTMLAnchorElement = document.createElement('a');
      link.href = '#';
      link.innerText = category.name;
      if (category.code === 'all') {
        link.addEventListener('click', this._handleAllCategoryClickEvent);
      } else {
        link.setAttribute('data-category', category.code);
        link.addEventListener('mouseover', this._handleCategoryMouseOverEvent);
      }
      li.appendChild(link);
      if (category.code !== 'all') {
        const objList: HTMLUListElement = document.createElement('ul');
        objList.id = `${ObjectContainerIdPrefix}-${this._containerId}-${category.code}`;
        objList.className = 'dropdown-menu';
        li.appendChild(objList);
      }
      if (this._categoryListDOM) {
        this._categoryListDOM.appendChild(li);
      }
    });

    // 重设原始标题
    if (this._titleDOM) {
      this._titleDOM.innerText = this.title;
    }
  }

  /**
   * 处理类别 DOM 鼠标移入事件
   *
   * @param ev
   */
  private _handleCategoryMouseOverEvent(ev: MouseEvent): void {
    if (ev && ev.target) {
      const link: HTMLAnchorElement = <HTMLAnchorElement>ev.target;
      const category: string | undefined = link.dataset['category']; // tslint:disable-line:no-string-literal

      // 判断是否已获取此分类对象
      const existed: boolean = !!this._objects.find((object: IOrganization): boolean => {
        return object.category === category;
      });

      // 如果不存在发送请求
      if (!existed) {
        this._evObjectRequest.raise(category);
      }
    }
  }

  /**
   * 处理全部分类点击事件
   *
   * @param ev
   */
  private _handleAllCategoryClickEvent(ev: MouseEvent): void {
    if (ev) {
      this._selectedObjects.forEach((item: IOrganization): void => {
        const selectedObject: HTMLLinkElement =
          <HTMLLinkElement>document.getElementById(`${ObjectIdPrefix}-${this._containerId}-${item.code}`);
        if (selectedObject) {
          selectedObject.className = '';
        }
      });

      this._selectedObjects = [];
      this._resetTitle();
    }
  }

  /**
   * 处理对象 DOM 鼠标点击事件
   *
   * @param ev
   */
  private _handleObjectClickEvent(ev: MouseEvent): void {
    if (ev && ev.currentTarget) {
      const link: HTMLAnchorElement = <HTMLAnchorElement>ev.currentTarget;
      const code: string | undefined = link.dataset['code']; // tslint:disable-line:no-string-literal
      const selected: String = link.className;

      if (selected === 'selected') { // 取消选中
        link.className = '';
        // 取消勾选的对象
        const uncheckedObject: IOrganization | undefined = this._selectedObjects.find((item: IOrganization): boolean => {
          return item.code === code;
        });

        this._selectedObjects = this._selectedObjects.filter((item: IOrganization): boolean => {
          return item.code !== code;
        });

        if (uncheckedObject) {
          this._evObjectChange.raise([uncheckedObject], false);
        }

        if (this.multiple) {
          ev.stopPropagation();
        }
      } else { // 设置选中
        link.className = 'selected';
        const checkedObject: IOrganization | undefined = this._objects.find((item: IOrganization): boolean => {
          return item.code === code;
        });

        if (this.multiple) {
          ev.stopPropagation();
          if (checkedObject) {
            this._selectedObjects.push(checkedObject);
          }
        } else {
          this._selectedObjects.forEach((item: IOrganization): void => {
            const prevSelectedObject: HTMLAnchorElement =
              <HTMLAnchorElement>document.getElementById(`${ObjectIdPrefix}-${this._containerId}-${item.code}`);
            if (prevSelectedObject) {
              prevSelectedObject.className = '';
            }
          });
          if (checkedObject) {
            this._selectedObjects = [checkedObject];
          }
        }

        if (checkedObject) {
          this._evObjectChange.raise([checkedObject], true);
        }
      }

      this._resetTitle();
    }
  }

  /**
   * 重置标题
   */
  private _resetTitle(): void {
    if (this._titleDOM) {
        let title: string = '';
        this._selectedObjects.forEach((item: IOrganization): void => {
          title += `${item.name}, `;
        });
        if (title) {
          title = title.substring(0, title.length - 2);
        }
        this._titleDOM.innerText = title ? title : this.title;
        this._titleDOM.title = title ? title : this.title;
    }
  }
}
