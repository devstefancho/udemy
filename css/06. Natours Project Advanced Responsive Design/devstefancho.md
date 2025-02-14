## Task
- How to use the `srcset` attribute on the `<img>` and `<source>` elements, together with density descriptors
- How and why to use the `<picture>` element for art direction
- How to write media queries in HTML
- How to implement responsive images in CSS
- How to use resolution media queries to target high-resolution screens with 2x
- How to combine multiple conditions in media queries
- How to use `@supports` feature queries
- Implement graceful degradation on selected properties
- How to use `backdrop-filter`

## Responsive Design

![responsive](./img/responsive.png)
### desktop은 max기준, mobile은 min 기준으로 설계
![](./img/res_width.png)

### 모바일로 설계시작시 장단점
![](./img/res_mobile_first.png)

### breakpoints를 만드는 방식
breakpoint는 media 사이즈를 나누는 기준점 정도로 생각하면 된다.
![](./img/res_breakpoint.png)
- Bad: 가장안좋은 방법은 기기 자체를 breakpoint로 잡는 것이다.
- Good: 기기군을 나눠서 breakpoint로 생각한다.
- Perfect: 사이즈를 조절하다가 breakpoint로 필요하다고 생각되는 시점을 breakpoint로 잡는다.

### 디바이스별 breakpoints 기기군을 나눈다면 (2017년 자료)
![](./img/res_breakpoint_sizes.png)

## media query 에서 `mixin` 적용과 `em` 사용
- `rem`과 `px`의 경우 특정 브라우저에서 제대로 동작하지 않는다. (즉 정확한 시점에 동작하지 않음), 따라서 `em`을 쓴다.
- 반복적으로 사용하기 때문에, mixin으로 만들어준다. `@content` 부분이 여기(`@include name(arg){ 여기 }`)부분에 들어가는 것이다.
- 브라우저의 width에 따라 font-size (rem으로 사용하는 사이즈) 가 바뀌도록 해준다.
```scss
// 1em = 16px
@mixin respond($breakpoint) {
    @if $breakpoint == big-desktop { @media (min-width: 112.5em) { @content; }; }   // above 1800px
    @if $breakpoint == tab-land { @media (max-width: 75em) { @content; }; }         // 1200px
    @if $breakpoint == tab-port { @media (max-width: 56.25em) { @content; }; }      // 900px
    @if $breakpoint == phone { @media (max-width: 37.5em) { @content; }; }          // 600px
}
/* breakpoints
big-desktop : bigger than original
tab-land : tablet-landscape size
tab-port : tablet-portrait size
phone : mobile size
 */
```
```scss
html {
    // 이 부분은 font 자체보다는 rem 을 위한 setup
    font-size: 62.5%; // 1rem = 10px, 10/16 = 62.5%
    @include respond(big-desktop) { font-size: 75%; }   // 1rem = 9px, 9/16 = 50% 
    @include respond(tab-land) { font-size: 56.25%; }   // 1rem = 9px, 9/16 = 50%
    @include respond(tab-port) { font-size: 50%; }      // 1rem = 9px, 9/16 = 50%
    @include respond(phone) { font-size: 30%; }         // 1rem = 9px, 9/16 = 50%
}
```

### responsive size for phone
- 휴대폰과 같이 터치하는 스크린은 hover을 쓰지 못하므로, hover 부분을 다 없애고, 앞뒤 뒤집히는 카드도, 뒤집히지 않도록 변경해줘야 한다.

## Responsive Image
### Responsive 이미지가 무엇인가?
![](./img/res_image.png)
### Responsive 이미지의 Usage
![](./img/res_image_usage.png)

### 개발자도구에서 현재 이미지 소스보기
![](./img/res_img_result.png)
- 마우스를 올려서, currentSource를 확인할 수 있다.

![](./img/res_img_resolution.png)
- 해상도를 임의로 변경하여 테스트 할 수 있다. (안될때도 있음)

### media query에 resolution 조건주기
- 아래와 같이 dpi를 조건에 추가할 수 있다.
- comma(,)는 OR을 의미한다. 따라서 `192dpi이상이고, 600px이상` 혹은 `2000px이상`인 경우만 큰 이미지를 쓰게 한 것이다.
- safari에서는 `min-resolution` 지원을 하지 않으므로 `-webkit-min-device-pixel-ratio`를 대신 사용한다.
```scss
@media (min-resolution: 192dpi) and (min-width: 600px),
(-webkit-min-device-pixel-ratio: 2) and (min-width: 600px),
(min-width: 2000px) {
    background-image: linear-gradient(
                    to right bottom,
                    rgba($color-secondary-light, 0.8),
                    rgba($color-secondary-dark, 0.8)),
    url(../img/hero.jpg);
}
```

### Testing for Browser Support with @supports
- [CANIUSE.COM](https://caniuse.com/) 에서 css property를 modern browser에서 사용할 수 있는지 테스트할 수 있다.
- `@supports`는 지원하는 경우에만 추가될 수 있게 해준다.
- 지원여부만 확인하는 것이므로, value값은 아무거나 넣어줘도 된다. 하지만 꼭 필요는 하다. 
  - (ex. clip-path가 지원되는 경우에 css를 추가한다면, `@supports (clip-path: polygon(0 0)) {  }` 이런식으로 아무 실제값으로 정의만 해주면 된다.)
```scss
@supports (-webkit-backdrop-filter: blur(10px)) or (backdrop-filter: blur(10px)) {
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    background-color: rgba($color-black, .3);
}
```

## NPM 스크립트로 Build Process
![](./img/build_process.png)
- COMPILATION: Sass를 CSS로 변환
- CONCATENATION: CSS 파일들을 합치기 (외부에서 갖고온 것들도 다 같이 합치기)
- PREFIXING: -webkit과 같이 브라우저 prefix가 있는 것들은 다 붙이기
- COMPRESSING: 파일크기 압축하기

## 기타 사항
### selection할때 스타일 주기
```scss
::selection {
  background-color: $color-primary;
  color: $color-white;
}
```

### touch device인 경우 media query
- 스크린이면서 56.25em 이하이거나, hover이 안되는 경우(모바일)
```scss
  @media only screen and (max-width: 56.25em),
only screen and (hover: none) {
}
```