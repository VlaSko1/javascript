"use strict";

/**
 * @property {Object} settings Объект с настройками галереи.
 * @property {string} settings.previewSelector Селектор обертки для миниатюр галереи.
 * @property {string} settings.openedImageWrapperClass Класс для обертки открытой картинки.
 * @property {string} settings.openedImageClass Класс открытой картинки.
 * @property {string} settings.openedImageScreenClass Класс для ширмы открытой картинки.
 * @property {string} settings.openedImageCloseBtnClass Класс для картинки кнопки закрыть.
 * @property {string} settings.openedImageCloseBtnSrc Путь до картинки кнопки закрыть.
 * @property {string} settings.galleryWrapperBackClass Класс для блока прокрутки назад.
 * @property {string} settings.galleryWrapperNextClass Класс для блока прокрутки вперед.
 * @property {string} settings.openedImageNotLoadingSrc Путь до картинки заглушки если основная картинка не загрузилась).
 */
const gallery = {
  settings: {
    previewSelector: '.mySuperGallery',
    openedImageWrapperClass: 'galleryWrapper',
    openedImageClass: 'galleryWrapper__image',
    openedImageScreenClass: 'galleryWrapper__screen',
    openedImageCloseBtnClass: 'galleryWrapper__close',
    openedImageCloseBtnSrc: 'images/gallery/close.png',
    openedImageNotLoadingSrc: 'images/gallery/not-loading2.png',
    galleryWrapperBackClass: 'galleryWrapper__Back',
    galleryWrapperNextClass: 'galleryWrapper__Next'
  },
  // Здесь будет храниться картинка-миниатюра, которую мы открыли.
  openedImageEl: null,
  /**
   * Инициализирует галерею, ставит обработчик события.
   * @param {Object} userSettings Объект настроек для галереи.
   */
  init(userSettings = {}) {
    // Записываем настройки, которые передал пользователь в наши настройки.
    Object.assign(this.settings, userSettings);

    // Находим элемент, где будут превью картинок и ставим обработчик на этот элемент,
    // при клике на этот элемент вызовем функцию containerClickHandler в нашем объекте
    // gallery и передадим туда событие MouseEvent, которое случилось.
    document
      .querySelector(this.settings.previewSelector)
      .addEventListener('click', event => this.containerClickHandler(event));
  },

  /**
   * Обработчик события клика для открытия картинки.
   * @param {MouseEvent} event Событие клики мышью.
   * @param {HTMLElement} event.target Целевой объект, куда был произведен клик.
   */
  containerClickHandler(event) {
    // Если целевой тег не был картинкой, то ничего не делаем, просто завершаем функцию.
    if (event.target.tagName !== 'IMG') {
      return;
    }
    // Заносим открытый элемент в свойство openedImageEl
    this.openedImageEl = event.target;

    // Открываем картинку с полученным из целевого тега (data-full_image_url аттрибут).
    
      this.openImage(event.target.dataset.full_image_url);
    
    
  },

  /**
   * Открывает картинку.
   * @param {string} src Ссылка на картинку, которую надо открыть.
   */
  openImage(src) {
    // Получаем контейнер для открытой картинки, в нем находим тег img и ставим ему нужный src.
    this.getScreenContainer().querySelector(`.${this.settings.openedImageClass}`).src = src;
  },

  /**
   * Возвращает контейнер для открытой картинки, либо создает такой контейнер, если его еще нет.
   * @returns {Element}
   */
  getScreenContainer() {
    // Получаем контейнер для открытой картинки.
    const galleryWrapperElement = document.querySelector(`.${this.settings.openedImageWrapperClass}`);
    // Если контейнер для открытой картинки существует - возвращаем его.
    if (galleryWrapperElement) {
      return galleryWrapperElement;
    }

    // Возвращаем полученный из метода createScreenContainer контейнер.
    return this.createScreenContainer();
  },

  /**
   * Создает контейнер для открытой картинки.
   * @returns {HTMLElement}
   */
  createScreenContainer() {
    // Создаем сам контейнер-обертку и ставим ему класс.
    const galleryWrapperElement = document.createElement('div');
    galleryWrapperElement.classList.add(this.settings.openedImageWrapperClass);

    // Создаем контейнер занавеса, ставим ему класс и добавляем в контейнер-обертку.
    const galleryScreenElement = document.createElement('div');
    galleryScreenElement.classList.add(this.settings.openedImageScreenClass);
    galleryWrapperElement.appendChild(galleryScreenElement);

    // Создаем картинку для кнопки закрыть, ставим класс, src и добавляем ее в контейнер-обертку.
    const closeImageElement = new Image();
    closeImageElement.classList.add(this.settings.openedImageCloseBtnClass);
    closeImageElement.src = this.settings.openedImageCloseBtnSrc;
    closeImageElement.addEventListener('click', () => this.close());
    galleryWrapperElement.appendChild(closeImageElement);

    // Создаем элемент прокрутки назад
    const backGalleryEl = document.createElement('div');
    backGalleryEl.classList.add(this.settings.galleryWrapperBackClass);
    backGalleryEl.addEventListener('click', () => this.getPrevImageOpen());
    galleryWrapperElement.appendChild(backGalleryEl);

    // Создаем элемент прокрутки вперед
    const nextGalleryEl = document.createElement('div');
    nextGalleryEl.classList.add(this.settings.galleryWrapperNextClass);
    nextGalleryEl.addEventListener('click', () => this.getNextImageOpen());
    galleryWrapperElement.appendChild(nextGalleryEl);

    // Создаем картинку, которую хотим открыть, ставим класс и добавляем ее в контейнер-обертку.
    const image = new Image();
    // Если картинка не найдена вставляем в созданную картинку путь к заглушке.
    image.addEventListener('error', () => image.src = this.settings.openedImageNotLoadingSrc); 

    image.classList.add(this.settings.openedImageClass);
    galleryWrapperElement.appendChild(image);

    // Добавляем контейнер-обертку в тег body.
    document.body.appendChild(galleryWrapperElement);

    // Возвращаем добавленный в body элемент, наш контейнер-обертку.
    return galleryWrapperElement;
  },

  /**
   * Закрывает (удаляет) контейнер для открытой картинки.
   */
  close() {
    document.querySelector(`.${this.settings.openedImageWrapperClass}`).remove();
  },

  /**
   * Возвращает предыдущий элемент (картинку) от открытой или последнюю картинку в контейнере,
   * если текущая открытая картинка первая.
   * @returns {Element} Предыдущую картинку от текущей открытой.
   */
  getPrevImage() {
    const prevOpenedImageElNow = this.openedImageEl.previousElementSibling;
    if (prevOpenedImageElNow){
      this.openedImageEl = prevOpenedImageElNow;
      return prevOpenedImageElNow;
    } else {
      this.openedImageEl = document.querySelector(`${this.settings.previewSelector} img:last-child`);
      return document.querySelector(`${this.settings.previewSelector} img:last-child`);
    }
  },

  /**
   * Открывает предыдущий слайд после нажатия на кнопку назад
   */
  getPrevImageOpen() {
    this.openImage(this.getPrevImage().dataset.full_image_url);
  },

  /**
   * Возвращает следующий элемент (картинку) от открытой или первую картинку в контейнере,
   * если текущая открытая картинка последняя.
   * @returns {Element} Следующую картинку от текущей открытой.
   */
  getNextImage() {
    const nextOpenedImageElNow = this.openedImageEl.nextElementSibling;
    if (nextOpenedImageElNow){
      this.openedImageEl = nextOpenedImageElNow;
      return nextOpenedImageElNow;
    } else {
      this.openedImageEl = document.querySelector(`${this.settings.previewSelector} img:first-child`);
      return document.querySelector(`${this.settings.previewSelector} img:first-child`);
    }
  },

  /**
   * Открывает следующий слайд после нажатия на кнопку прокрутки вперед
   */
  getNextImageOpen() {
    this.openImage(this.getNextImage().dataset.full_image_url);
  },
};

// Инициализируем нашу галерею при загрузке страницы.
window.onload = () => gallery.init({previewSelector: '.galleryPreviewsContainer'});