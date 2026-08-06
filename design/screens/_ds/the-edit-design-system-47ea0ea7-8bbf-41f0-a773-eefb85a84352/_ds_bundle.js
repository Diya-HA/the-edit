/* @ds-bundle: {"format":4,"namespace":"TheEditDesignSystem_47ea0e","components":[{"name":"Button","sourcePath":"components/actions/Button.jsx"},{"name":"Avatar","sourcePath":"components/display/Avatar.jsx"},{"name":"Badge","sourcePath":"components/display/Badge.jsx"},{"name":"BoardCard","sourcePath":"components/display/BoardCard.jsx"},{"name":"BrandRow","sourcePath":"components/display/BrandRow.jsx"},{"name":"CanvasSwatch","sourcePath":"components/display/CanvasSwatch.jsx"},{"name":"ProductCard","sourcePath":"components/display/ProductCard.jsx"},{"name":"BottomSheet","sourcePath":"components/feedback/BottomSheet.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Chip","sourcePath":"components/forms/Chip.jsx"},{"name":"ColorDot","sourcePath":"components/forms/ColorDot.jsx"},{"name":"SearchField","sourcePath":"components/forms/SearchField.jsx"},{"name":"TabBar","sourcePath":"components/navigation/TabBar.jsx"}],"sourceHashes":{"components/actions/Button.jsx":"6d9ced0d249a","components/display/Avatar.jsx":"80fd03d176e8","components/display/Badge.jsx":"0833304db37d","components/display/BoardCard.jsx":"981db3db9e12","components/display/BrandRow.jsx":"bccf9bced494","components/display/CanvasSwatch.jsx":"350be5a2ec1e","components/display/ProductCard.jsx":"104888ab1d1a","components/feedback/BottomSheet.jsx":"35fb3f653df2","components/feedback/Toast.jsx":"3cdea6d4613f","components/forms/Chip.jsx":"774abf83404b","components/forms/ColorDot.jsx":"5411aa93fc66","components/forms/SearchField.jsx":"c830e9a27751","components/navigation/TabBar.jsx":"3901d4b33597","ui_kits/the-edit-app/App.jsx":"c7cd155b151e","ui_kits/the-edit-app/PhoneFrame.jsx":"e5c32fbe5406","ui_kits/the-edit-app/data.js":"74d2cff113fe"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.TheEditDesignSystem_47ea0e = window.TheEditDesignSystem_47ea0e || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/actions/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Button — The Edit's action primitive. Ink-filled primary CTA,
 * a ghost/outline for toggles like Follow, and a subtle secondary.
 * Pill-shaped, mono-free, weighty sans.
 */
function Button({
  variant = 'primary',
  size = 'md',
  full = false,
  children,
  style,
  ...rest
}) {
  const sizes = {
    sm: {
      padding: '8px 16px',
      fontSize: 12.5
    },
    md: {
      padding: '13px 22px',
      fontSize: 15
    },
    lg: {
      padding: '16px 28px',
      fontSize: 16
    }
  };
  const variants = {
    primary: {
      background: 'var(--ink-0)',
      color: 'var(--canvas-1)',
      border: '1.5px solid var(--ink-0)'
    },
    brand: {
      background: 'var(--brand)',
      color: 'var(--brand-ink)',
      border: '1.5px solid var(--brand)'
    },
    secondary: {
      background: 'var(--surface-sunken)',
      color: 'var(--text-strong)',
      border: '1.5px solid transparent'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-muted)',
      border: '1.5px solid var(--border)'
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({}, rest, {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      width: full ? '100%' : 'auto',
      borderRadius: 'var(--radius-pill)',
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      letterSpacing: '0.01em',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      transition: 'transform var(--dur-fast) var(--ease-out), opacity var(--dur-fast) var(--ease-out)',
      ...sizes[size],
      ...variants[variant],
      ...style
    },
    onMouseDown: e => {
      e.currentTarget.style.transform = 'scale(0.97)';
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = 'scale(1)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'scale(1)';
    }
  }), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Button.jsx", error: String((e && e.message) || e) }); }

// components/display/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Avatar — a round initials chip. The Edit uses solid pigment
 * fills with white initials in the app header.
 */
function Avatar({
  initials = 'AL',
  size = 38,
  color = 'var(--brand)',
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      width: size,
      height: size,
      borderRadius: 'var(--radius-pill)',
      background: color,
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: Math.round(size * 0.34),
      flex: '0 0 auto',
      ...style
    }
  }), initials);
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/display/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Badge — a compact mono tag. Used for price-drop percentages,
 * "NEW", and other short status markers.
 */
function Badge({
  children,
  tone = 'sale',
  style,
  ...rest
}) {
  const tones = {
    sale: {
      background: 'var(--sale)',
      color: '#fff'
    },
    brand: {
      background: 'var(--brand)',
      color: 'var(--brand-ink)'
    },
    cobalt: {
      background: 'var(--pig-cobalt)',
      color: '#fff'
    },
    ink: {
      background: 'var(--ink-0)',
      color: 'var(--canvas-1)'
    },
    outline: {
      background: 'transparent',
      color: 'var(--ink-1)',
      boxShadow: 'inset 0 0 0 1.5px var(--border)'
    }
  };
  return /*#__PURE__*/React.createElement("span", _extends({}, rest, {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '3px 8px',
      borderRadius: 'var(--radius-sm)',
      font: 'var(--type-kicker)',
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.02em',
      whiteSpace: 'nowrap',
      ...tones[tone],
      ...style
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/display/BoardCard.jsx
try { (() => {
/**
 * BoardCard — a mood-board tile: a 3-panel painted cover built
 * from the board's first pieces, then name + count.
 */
function BoardCard({
  name,
  count,
  colors = [],
  onOpen,
  style
}) {
  const tiles = colors.slice(0, 3);
  while (tiles.length < 3) tiles.push('var(--canvas-2)');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      cursor: onOpen ? 'pointer' : 'default',
      ...style
    },
    onClick: onOpen
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      height: 116,
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      marginBottom: 8
    }
  }, tiles.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      flex: 1,
      background: c,
      borderRight: i < 2 ? '2px solid var(--surface-card)' : 'none',
      backgroundImage: 'var(--texture-pointillism)',
      backgroundSize: '7px 7px, 9px 9px, 6px 6px, 11px 11px'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--text-strong)'
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 12,
      color: 'var(--text-muted)',
      marginTop: 2
    }
  }, count + (count === 1 ? ' piece' : ' pieces')));
}
Object.assign(__ds_scope, { BoardCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/BoardCard.jsx", error: String((e && e.message) || e) }); }

// components/display/BrandRow.jsx
try { (() => {
/**
 * BrandRow — a shelf list item: pigment swatch, brand name + meta,
 * and a follow toggle. Divided by a hairline.
 */
function BrandRow({
  name,
  meta,
  color = 'var(--pig-cobalt)',
  following = false,
  onFollow,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 13,
      padding: '10px 2px',
      borderBottom: '1px solid var(--border)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 46,
      height: 46,
      borderRadius: 'var(--radius-md)',
      background: color,
      flex: '0 0 auto',
      backgroundImage: 'var(--texture-pointillism)',
      backgroundSize: '7px 7px, 9px 9px, 6px 6px, 11px 11px',
      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--text-strong)'
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 12,
      color: 'var(--text-muted)',
      marginTop: 2
    }
  }, meta)), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: following ? 'ghost' : 'primary',
    size: "sm",
    onClick: onFollow
  }, following ? 'Following' : 'Follow'));
}
Object.assign(__ds_scope, { BrandRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/BrandRow.jsx", error: String((e && e.message) || e) }); }

// components/display/CanvasSwatch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * CanvasSwatch — The Edit's signature painted color field.
 * A pigment fill dressed with a pointillist dab texture and a
 * brushstroke sheen, evoking Impressionist / Neo-Impressionist
 * canvas. Used as the product-image placeholder and anywhere the
 * brand wants a "painted" surface.
 */
function CanvasSwatch({
  color = 'var(--pig-cobalt)',
  height = 240,
  radius = 'var(--radius-xl)',
  caption,
  captionColor,
  wash = false,
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      position: 'relative',
      width: '100%',
      height,
      borderRadius: radius,
      backgroundColor: color,
      overflow: 'hidden',
      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)',
      ...style
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      backgroundImage: 'var(--texture-pointillism)',
      backgroundSize: '7px 7px, 9px 9px, 6px 6px, 11px 11px',
      mixBlendMode: 'soft-light',
      opacity: 0.9
    }
  }), wash && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--texture-wash)',
      mixBlendMode: 'screen',
      opacity: 0.55
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--texture-sheen)',
      pointerEvents: 'none'
    }
  }), caption && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 12,
      right: 12,
      top: '50%',
      transform: 'translateY(-50%)',
      textAlign: 'center',
      font: 'var(--type-kicker)',
      fontSize: 10.5,
      letterSpacing: 'var(--ls-kicker)',
      textTransform: 'uppercase',
      color: captionColor || 'rgba(255,255,255,0.72)',
      pointerEvents: 'none',
      mixBlendMode: 'overlay'
    }
  }, caption), children);
}
Object.assign(__ds_scope, { CanvasSwatch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/CanvasSwatch.jsx", error: String((e && e.message) || e) }); }

// components/display/ProductCard.jsx
try { (() => {
/**
 * ProductCard — the core feed unit. A painted CanvasSwatch image,
 * a floating save heart, optional price-drop badge, then brand /
 * title / price meta. Prices render in mono.
 */
function ProductCard({
  brand,
  title,
  price,
  was,
  color = 'var(--pig-cobalt)',
  caption,
  captionColor,
  height = 240,
  saved = false,
  onOpen,
  onSave,
  style
}) {
  const drop = was ? Math.round((1 - price / was) * 100) : 0;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-block',
      width: '100%',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      cursor: onOpen ? 'pointer' : 'default'
    },
    onClick: onOpen
  }, /*#__PURE__*/React.createElement(__ds_scope.CanvasSwatch, {
    color: color,
    height: height,
    caption: caption,
    captionColor: captionColor
  }), was && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 9,
      left: 9
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "sale"
  }, '↓ ' + drop + '%')), /*#__PURE__*/React.createElement("div", {
    onClick: e => {
      if (onSave) {
        e.stopPropagation();
        onSave(e);
      }
    },
    style: {
      position: 'absolute',
      top: 9,
      right: 9,
      width: 31,
      height: 31,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--glass-bg)',
      backdropFilter: 'var(--glass-blur)',
      WebkitBackdropFilter: 'var(--glass-blur)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 15,
      lineHeight: 1,
      color: saved ? 'var(--brand)' : '#4a4a4a',
      cursor: 'pointer',
      boxShadow: 'var(--shadow-float)'
    }
  }, saved ? '♥' : '♡')), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 3px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-label)',
      fontSize: 9.5,
      letterSpacing: 'var(--ls-wide)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      marginBottom: 3
    }
  }, brand), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5,
      fontWeight: 500,
      lineHeight: 1.25,
      color: 'var(--text-strong)',
      marginBottom: 4
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-price)',
      fontSize: 13.5,
      color: 'var(--text-strong)'
    }
  }, '$' + price), was && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11.5,
      color: 'var(--text-muted)',
      textDecoration: 'line-through'
    }
  }, '$' + was))));
}
Object.assign(__ds_scope, { ProductCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/ProductCard.jsx", error: String((e && e.message) || e) }); }

// components/feedback/BottomSheet.jsx
try { (() => {
/**
 * BottomSheet — a bottom-anchored modal with a scrim and grab
 * handle. Used for "Save to board". Render only when open.
 */
function BottomSheet({
  open,
  title,
  onClose,
  children,
  style
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 9,
      background: 'rgba(20,16,12,0.4)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 10,
      background: 'var(--surface-card)',
      borderTopLeftRadius: 'var(--radius-2xl)',
      borderTopRightRadius: 'var(--radius-2xl)',
      padding: '12px 18px 36px',
      maxHeight: '74%',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: 'var(--shadow-sheet)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 4,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--border)',
      margin: '0 auto 14px'
    }
  }), title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      fontStretch: '90%',
      fontSize: 26,
      color: 'var(--text-strong)',
      marginBottom: 12
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowY: 'auto'
    }
  }, children)));
}
Object.assign(__ds_scope, { BottomSheet });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/BottomSheet.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
/**
 * Toast — a transient confirmation pill (e.g. "Saved to Soft
 * summer"). Ink-filled, floats above the tab bar. Render only
 * while `message` is set.
 */
function Toast({
  message,
  style
}) {
  if (!message) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 96,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 12,
      background: 'var(--ink-0)',
      color: 'var(--canvas-1)',
      padding: '11px 20px',
      borderRadius: 'var(--radius-pill)',
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      fontWeight: 600,
      whiteSpace: 'nowrap',
      boxShadow: 'var(--shadow-lg)',
      ...style
    }
  }, message);
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/forms/Chip.jsx
try { (() => {
/**
 * Chip — a category filter pill. Sunken by default, ink-filled
 * when active. Rows scroll horizontally in the feed sub-header.
 */
function Chip({
  label,
  active = false,
  onClick,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      flex: '0 0 auto',
      padding: '7px 14px',
      borderRadius: 'var(--radius-pill)',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 12.5,
      fontWeight: 600,
      whiteSpace: 'nowrap',
      background: active ? 'var(--ink-0)' : 'var(--surface-sunken)',
      color: active ? 'var(--canvas-1)' : 'var(--text-strong)',
      transition: 'background var(--dur-fast) var(--ease-out)',
      ...style
    }
  }, label);
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Chip.jsx", error: String((e && e.message) || e) }); }

// components/forms/ColorDot.jsx
try { (() => {
/**
 * ColorDot — a palette-filter swatch. A pigment dot inside a ring
 * that darkens when the color is the active filter.
 */
function ColorDot({
  color,
  active = false,
  onClick,
  size = 26,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      flex: '0 0 auto',
      padding: 3,
      borderRadius: 'var(--radius-pill)',
      border: active ? '2px solid var(--ink-0)' : '2px solid transparent',
      cursor: 'pointer',
      transition: 'border-color var(--dur-fast)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: 'var(--radius-pill)',
      background: color,
      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)'
    }
  }));
}
Object.assign(__ds_scope, { ColorDot });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/ColorDot.jsx", error: String((e && e.message) || e) }); }

// components/forms/SearchField.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SearchField — the feed search input. Rounded, card-surfaced,
 * hairline border, generous padding.
 */
function SearchField({
  value,
  onChange,
  placeholder = 'Search the edit — brand, piece, vibe',
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("input", _extends({}, rest, {
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    style: {
      width: '100%',
      boxSizing: 'border-box',
      padding: '13px 16px',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border)',
      background: 'var(--surface-card)',
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      color: 'var(--text-strong)',
      outline: 'none',
      ...style
    },
    onFocus: e => {
      e.target.style.borderColor = 'var(--focus-ring)';
    },
    onBlur: e => {
      e.target.style.borderColor = 'var(--border)';
    }
  }));
}
Object.assign(__ds_scope, { SearchField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SearchField.jsx", error: String((e && e.message) || e) }); }

// components/navigation/TabBar.jsx
try { (() => {
const ICONS = {
  feed: /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.9"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "3",
    width: "7",
    height: "7",
    rx: "1.4"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14",
    y: "3",
    width: "7",
    height: "7",
    rx: "1.4"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "14",
    width: "7",
    height: "7",
    rx: "1.4"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14",
    y: "14",
    width: "7",
    height: "7",
    rx: "1.4"
  })),
  search: /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.9"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M20 20l-3.5-3.5",
    strokeLinecap: "round"
  })),
  boards: /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.9"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 3.5h12a1 1 0 0 1 1 1V21l-7-4.6L5 21V4.5a1 1 0 0 1 1-1z",
    strokeLinejoin: "round"
  })),
  shelf: /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.9"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 4.5h6l11 11-5 5-11-11v-5z",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "8.5",
    r: "1.4",
    fill: "currentColor",
    stroke: "none"
  }))
};

/**
 * TabBar — the app's bottom navigation. Icon + mono caption per
 * tab; the active tab goes ink, the rest muted.
 */
function TabBar({
  active = 'feed',
  onChange,
  items,
  style
}) {
  const tabs = items || [{
    key: 'feed',
    label: 'Feed'
  }, {
    key: 'search',
    label: 'Search'
  }, {
    key: 'boards',
    label: 'Boards'
  }, {
    key: 'shelf',
    label: 'Shelf'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'stretch',
      background: 'var(--surface-card)',
      borderTop: '1px solid var(--border)',
      ...style
    }
  }, tabs.map(t => {
    const on = active === t.key;
    return /*#__PURE__*/React.createElement("div", {
      key: t.key,
      onClick: () => onChange && onChange(t.key),
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        padding: '9px 0 6px',
        cursor: 'pointer',
        color: on ? 'var(--ink-0)' : 'var(--text-muted)'
      }
    }, ICONS[t.icon || t.key], /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--type-kicker)',
        fontSize: 8.5,
        letterSpacing: '0.08em',
        textTransform: 'uppercase'
      }
    }, t.label));
  }));
}
Object.assign(__ds_scope, { TabBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/TabBar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/the-edit-app/App.jsx
try { (() => {
/* The Edit — interactive app shell. Composes the design-system
   components from window.TheEditDesignSystem_47ea0e. */
const NS = window.TheEditDesignSystem_47ea0e;
const {
  ProductCard,
  BoardCard,
  BrandRow,
  Chip,
  ColorDot,
  SearchField,
  TabBar,
  Toast,
  BottomSheet,
  Avatar,
  CanvasSwatch,
  Badge
} = NS;
const {
  useState
} = React;
const D = window.TE_DATA;
const colorOf = key => (D.palette.find(p => p.key === key) || {}).color || 'var(--pig-cobalt)';
const nameOf = key => (D.palette.find(p => p.key === key) || {}).name || key;
const find = id => D.products.find(p => p.id === id);
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
function App() {
  const [tab, setTab] = useState('feed');
  const [detailId, setDetailId] = useState(null);
  const [colorFilter, setColorFilter] = useState(null);
  const [catFilter, setCatFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [saveFor, setSaveFor] = useState(null);
  const [openBoardId, setOpenBoardId] = useState(null);
  const [toast, setToast] = useState('');
  const [boards, setBoards] = useState(D.boards);
  const [following, setFollowing] = useState(D.following);
  const flash = m => {
    setToast(m);
    clearTimeout(window.__t);
    window.__t = setTimeout(() => setToast(''), 1800);
  };
  const isSaved = id => boards.some(b => b.items.includes(id));
  const toggleBoard = (boardId, pid) => {
    let added = false,
      name = '';
    setBoards(bs => bs.map(b => {
      if (b.id !== boardId) return b;
      name = b.name;
      const has = b.items.includes(pid);
      added = !has;
      return {
        ...b,
        items: has ? b.items.filter(x => x !== pid) : b.items.concat([pid])
      };
    }));
    setSaveFor(null);
    flash(added ? `Saved to ${name}` : `Removed from ${name}`);
  };
  const newBoard = pid => {
    const p = find(pid);
    const name = cap(p.cat);
    setBoards(bs => bs.concat([{
      id: 'b' + Date.now(),
      name,
      items: [pid]
    }]));
    setSaveFor(null);
    flash(`New board · ${name}`);
  };
  const toggleFollow = brand => {
    setFollowing(f => {
      const n = {
        ...f
      };
      if (n[brand]) delete n[brand];else n[brand] = true;
      return n;
    });
    flash(following[brand] ? `Unfollowed ${brand}` : `Following ${brand}`);
  };
  const q = query.trim().toLowerCase();
  const grid = D.products.filter(p => (colorFilter ? p.color === colorFilter : true) && (catFilter === 'all' ? true : p.cat === catFilter) && (q ? (p.title + ' ' + p.brand + ' ' + p.cat).toLowerCase().includes(q) : true));
  const cats = ['all'].concat(Array.from(new Set(D.products.map(p => p.cat))));

  // ---- header ----
  const header = /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0,
      background: 'var(--surface-card)',
      borderBottom: '1px solid var(--border)',
      paddingTop: 48,
      zIndex: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      padding: '8px 18px 4px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontStretch: '88%',
      textTransform: 'uppercase',
      letterSpacing: '-0.02em',
      fontSize: 34,
      lineHeight: .88,
      color: 'var(--ink-0)'
    }
  }, "The Edit"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontStyle: 'italic',
      fontSize: 16,
      color: 'var(--brand)',
      marginTop: 3
    }
  }, D.aesthetic)), /*#__PURE__*/React.createElement(Avatar, {
    initials: "AL",
    color: "var(--pig-cobalt)"
  })), (tab === 'feed' || tab === 'search') && !detailId && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-kicker)',
      fontSize: 9.5,
      letterSpacing: 'var(--ls-kicker)',
      color: 'var(--text-muted)',
      padding: '0 18px 8px'
    }
  }, "FILTER BY PALETTE"), /*#__PURE__*/React.createElement("div", {
    className: "sc-scroll",
    style: {
      display: 'flex',
      gap: 8,
      padding: '0 18px 12px',
      overflowX: 'auto'
    }
  }, D.palette.map(p => /*#__PURE__*/React.createElement(ColorDot, {
    key: p.key,
    color: p.color,
    active: colorFilter === p.key,
    onClick: () => setColorFilter(colorFilter === p.key ? null : p.key)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "sc-scroll",
    style: {
      display: 'flex',
      gap: 8,
      padding: '0 18px',
      overflowX: 'auto'
    }
  }, cats.map(k => /*#__PURE__*/React.createElement(Chip, {
    key: k,
    label: k === 'all' ? 'All' : cap(k),
    active: catFilter === k,
    onClick: () => setCatFilter(k)
  })))));

  // ---- content ----
  let content = [];
  if (tab === 'feed' || tab === 'search') {
    if (tab === 'search') content.push(/*#__PURE__*/React.createElement("div", {
      key: "s",
      style: {
        padding: '2px 2px 14px'
      }
    }, /*#__PURE__*/React.createElement(SearchField, {
      value: query,
      onChange: e => setQuery(e.target.value)
    })));
    content.push(/*#__PURE__*/React.createElement("div", {
      key: "m",
      style: {
        font: 'var(--type-kicker)',
        fontSize: 10,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        padding: '0 2px 12px'
      }
    }, (colorFilter ? nameOf(colorFilter) + ' · ' : '') + grid.length + ' pieces in the edit'));
    content.push(/*#__PURE__*/React.createElement("div", {
      key: "g",
      style: {
        columnCount: 2,
        columnGap: 12
      }
    }, grid.map(p => /*#__PURE__*/React.createElement("div", {
      key: p.id,
      style: {
        breakInside: 'avoid',
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement(ProductCard, {
      brand: p.brand,
      title: p.title,
      price: p.price,
      was: p.was,
      color: colorOf(p.color),
      caption: p.cat,
      height: p.h * 0.7,
      saved: isSaved(p.id),
      onOpen: () => setDetailId(p.id),
      onSave: () => setSaveFor(p.id)
    })))));
    if (!grid.length) content.push(/*#__PURE__*/React.createElement("div", {
      key: "e",
      style: {
        textAlign: 'center',
        padding: '50px 20px',
        color: 'var(--text-muted)'
      }
    }, "Nothing in this palette yet \u2014 try another color."));
  }
  if (tab === 'boards') {
    const ob = boards.find(b => b.id === openBoardId);
    if (ob) {
      content.push(/*#__PURE__*/React.createElement("div", {
        key: "bh",
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '2px 2px 16px'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontWeight: 600,
          fontSize: 13,
          color: 'var(--brand)',
          cursor: 'pointer'
        },
        onClick: () => setOpenBoardId(null)
      }, "\u2039 Boards"), /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          fontStretch: '90%',
          fontSize: 27,
          color: 'var(--ink-0)'
        }
      }, ob.name)));
      content.push(/*#__PURE__*/React.createElement("div", {
        key: "bg",
        style: {
          columnCount: 2,
          columnGap: 12
        }
      }, ob.items.map(find).filter(Boolean).map(p => /*#__PURE__*/React.createElement("div", {
        key: p.id,
        style: {
          breakInside: 'avoid',
          marginBottom: 14
        }
      }, /*#__PURE__*/React.createElement(ProductCard, {
        brand: p.brand,
        title: p.title,
        price: p.price,
        was: p.was,
        color: colorOf(p.color),
        caption: p.cat,
        height: 150,
        saved: isSaved(p.id),
        onOpen: () => setDetailId(p.id),
        onSave: () => setSaveFor(p.id)
      })))));
    } else {
      content.push(/*#__PURE__*/React.createElement("div", {
        key: "bt",
        style: {
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          fontStretch: '90%',
          fontSize: 31,
          lineHeight: .95,
          color: 'var(--ink-0)',
          padding: '4px 2px 2px'
        }
      }, "Your boards"));
      content.push(/*#__PURE__*/React.createElement("div", {
        key: "bgd",
        style: {
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 14,
          paddingTop: 12
        }
      }, boards.map(b => /*#__PURE__*/React.createElement(BoardCard, {
        key: b.id,
        name: b.name,
        count: b.items.length,
        colors: b.items.slice(0, 3).map(id => {
          const p = find(id);
          return p ? colorOf(p.color) : 'var(--canvas-2)';
        }),
        onOpen: () => setOpenBoardId(b.id)
      }))));
    }
  }
  if (tab === 'shelf') {
    const drops = D.products.filter(p => p.was);
    const brands = Array.from(new Set(D.products.map(p => p.brand)));
    content.push(/*#__PURE__*/React.createElement("div", {
      key: "dt",
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        letterSpacing: '-0.02em',
        fontStretch: '90%',
        fontSize: 31,
        lineHeight: .95,
        color: 'var(--ink-0)',
        padding: '4px 2px 2px'
      }
    }, "Price drops"));
    content.push(/*#__PURE__*/React.createElement("div", {
      key: "ds",
      style: {
        fontSize: 13,
        color: 'var(--text-muted)',
        padding: '2px 2px 12px'
      }
    }, "On pieces from your shelf"));
    content.push(/*#__PURE__*/React.createElement("div", {
      key: "dr",
      className: "sc-scroll",
      style: {
        display: 'flex',
        gap: 12,
        overflowX: 'auto',
        paddingBottom: 18,
        margin: '0 -2px',
        padding: '0 2px 18px'
      }
    }, drops.map(p => /*#__PURE__*/React.createElement("div", {
      key: p.id,
      style: {
        flex: '0 0 150px',
        width: 150
      }
    }, /*#__PURE__*/React.createElement(ProductCard, {
      brand: p.brand,
      title: p.title,
      price: p.price,
      was: p.was,
      color: colorOf(p.color),
      caption: p.cat,
      height: 150,
      saved: isSaved(p.id),
      onOpen: () => setDetailId(p.id),
      onSave: () => setSaveFor(p.id)
    })))));
    content.push(/*#__PURE__*/React.createElement("div", {
      key: "st",
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        letterSpacing: '-0.02em',
        fontStretch: '90%',
        fontSize: 31,
        lineHeight: .95,
        color: 'var(--ink-0)',
        padding: '4px 2px 2px'
      }
    }, "The shelf"));
    content.push(/*#__PURE__*/React.createElement("div", {
      key: "sl",
      style: {
        paddingTop: 10
      }
    }, brands.map(name => {
      const items = D.products.filter(p => p.brand === name);
      const nd = items.filter(p => p.was).length;
      return /*#__PURE__*/React.createElement(BrandRow, {
        key: name,
        name: name,
        meta: items.length + ' pieces' + (nd ? ' · ' + nd + ' price drop' + (nd > 1 ? 's' : '') : ''),
        color: colorOf(items[0].color),
        following: !!following[name],
        onFollow: () => toggleFollow(name)
      });
    })));
  }

  // ---- detail overlay ----
  let detail = null;
  if (detailId) {
    const p = find(detailId);
    if (p) {
      const saved = isSaved(p.id);
      const pct = p.was ? Math.round((1 - p.price / p.was) * 100) : 0;
      const similar = D.products.filter(x => x.id !== p.id && (x.color === p.color || x.cat === p.cat)).slice(0, 6);
      detail = /*#__PURE__*/React.createElement("div", {
        className: "sc-scroll",
        style: {
          position: 'absolute',
          inset: 0,
          zIndex: 8,
          background: 'var(--surface-app)',
          overflowY: 'auto'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'absolute',
          top: 52,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0 16px',
          zIndex: 3
        }
      }, /*#__PURE__*/React.createElement(GlassBtn, {
        onClick: () => setDetailId(null)
      }, "\u2715"), /*#__PURE__*/React.createElement(GlassBtn, {
        onClick: () => setSaveFor(p.id),
        color: saved ? 'var(--brand)' : '#4a4a4a'
      }, saved ? '♥' : '♡')), /*#__PURE__*/React.createElement(CanvasSwatch, {
        color: colorOf(p.color),
        height: 372,
        radius: "0",
        caption: p.cat,
        wash: true
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          padding: '20px 20px 40px'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          font: 'var(--type-label)',
          fontSize: 9.5,
          letterSpacing: 'var(--ls-wide)',
          textTransform: 'uppercase',
          color: 'var(--text-muted)'
        }
      }, p.brand), /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          fontStretch: '90%',
          fontSize: 38,
          lineHeight: .96,
          color: 'var(--ink-0)',
          margin: '2px 0 12px'
        }
      }, p.title), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'baseline',
          gap: 10,
          marginBottom: 16
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: 'var(--font-mono)',
          fontSize: 22,
          fontWeight: 700,
          color: 'var(--ink-0)'
        }
      }, '$' + p.price), p.was && /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          color: 'var(--text-muted)',
          textDecoration: 'line-through'
        }
      }, '$' + p.was), p.was && /*#__PURE__*/React.createElement(Badge, {
        tone: "sale"
      }, '↓ ' + pct + '% drop')), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 16
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 20,
          height: 20,
          borderRadius: 999,
          background: colorOf(p.color),
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)'
        }
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 13,
          color: 'var(--text-muted)'
        }
      }, nameOf(p.color))), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 14.5,
          lineHeight: 1.55,
          color: 'var(--text-body)',
          marginBottom: 22
        }
      }, "A ", p.cat.replace(/s$/, ''), " piece from the ", D.aesthetic, " edit \u2014 chosen to layer into one cohesive wardrobe."), /*#__PURE__*/React.createElement("div", {
        onClick: () => setSaveFor(p.id),
        style: {
          textAlign: 'center',
          padding: 15,
          borderRadius: 'var(--radius-lg)',
          background: 'var(--ink-0)',
          color: 'var(--canvas-1)',
          fontWeight: 700,
          fontSize: 15,
          cursor: 'pointer',
          marginBottom: 30
        }
      }, saved ? 'Saved ♥ · Edit boards' : 'Save to board'), /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          fontStretch: '90%',
          fontSize: 27,
          color: 'var(--ink-0)',
          marginBottom: 14
        }
      }, "More like this"), /*#__PURE__*/React.createElement("div", {
        style: {
          columnCount: 2,
          columnGap: 12
        }
      }, similar.map(x => /*#__PURE__*/React.createElement("div", {
        key: x.id,
        style: {
          breakInside: 'avoid',
          marginBottom: 14
        }
      }, /*#__PURE__*/React.createElement(ProductCard, {
        brand: x.brand,
        title: x.title,
        price: x.price,
        was: x.was,
        color: colorOf(x.color),
        caption: x.cat,
        height: 150,
        saved: isSaved(x.id),
        onOpen: () => setDetailId(x.id),
        onSave: () => setSaveFor(x.id)
      }))))));
    }
  }
  return /*#__PURE__*/React.createElement(window.PhoneFrame, null, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      background: 'var(--surface-app)',
      color: 'var(--ink-0)',
      fontFamily: 'var(--font-sans)',
      overflow: 'hidden'
    }
  }, header, /*#__PURE__*/React.createElement("div", {
    className: "sc-scroll",
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '14px 14px 12px',
      position: 'relative'
    }
  }, content), /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0,
      paddingBottom: 22
    }
  }, /*#__PURE__*/React.createElement(TabBar, {
    active: tab,
    onChange: k => {
      setTab(k);
      setOpenBoardId(null);
    }
  })), detail, /*#__PURE__*/React.createElement(BottomSheet, {
    open: !!saveFor,
    title: "Save to board",
    onClose: () => setSaveFor(null)
  }, saveFor && boards.map(b => {
    const checked = b.items.includes(saveFor);
    const cover = b.items[0] ? colorOf(find(b.items[0]).color) : 'var(--canvas-2)';
    return /*#__PURE__*/React.createElement("div", {
      key: b.id,
      onClick: () => toggleBoard(b.id, saveFor),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 13,
        padding: '9px 0',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 44,
        height: 44,
        borderRadius: 10,
        background: cover,
        flex: '0 0 auto'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 15,
        fontWeight: 600
      }
    }, b.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--text-muted)'
      }
    }, b.items.length, " saved")), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 26,
        height: 26,
        borderRadius: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 700,
        background: checked ? 'var(--brand)' : 'transparent',
        border: checked ? 'none' : '1.5px solid var(--border)'
      }
    }, checked ? '✓' : ''));
  }), saveFor && /*#__PURE__*/React.createElement("div", {
    onClick: () => newBoard(saveFor),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 13,
      padding: '12px 0 4px',
      cursor: 'pointer',
      marginTop: 4,
      borderTop: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 44,
      height: 44,
      borderRadius: 10,
      border: '1.5px dashed var(--text-muted)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 20,
      color: 'var(--text-muted)'
    }
  }, "\uFF0B"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--brand)'
    }
  }, "Create new board"))), /*#__PURE__*/React.createElement(Toast, {
    message: toast
  })));
}
function GlassBtn({
  children,
  onClick,
  color = '#4a4a4a'
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      width: 40,
      height: 40,
      borderRadius: 999,
      background: 'var(--glass-bg)',
      backdropFilter: 'var(--glass-blur)',
      WebkitBackdropFilter: 'var(--glass-blur)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 16,
      color,
      cursor: 'pointer',
      boxShadow: 'var(--shadow-float)'
    }
  }, children);
}
window.TheEditApp = App;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/the-edit-app/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/the-edit-app/PhoneFrame.jsx
try { (() => {
/* Minimal iOS-style phone frame for the UI kit. */
function PhoneFrame({
  children,
  width = 390,
  height = 800
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      height,
      flex: '0 0 auto',
      borderRadius: 46,
      overflow: 'hidden',
      position: 'relative',
      background: 'var(--surface-app)',
      boxShadow: '0 40px 80px rgba(14,14,16,0.18), 0 0 0 1px rgba(0,0,0,0.10)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 11,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 120,
      height: 34,
      borderRadius: 22,
      background: '#000',
      zIndex: 50
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 20,
      display: 'flex',
      justifyContent: 'space-between',
      padding: '17px 28px 0',
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: '-apple-system, system-ui',
      fontWeight: 600,
      fontSize: 15,
      color: 'var(--ink-0)'
    }
  }, "9:41"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: '-apple-system, system-ui',
      fontWeight: 600,
      fontSize: 13,
      color: 'var(--ink-0)',
      letterSpacing: 1
    }
  }, "\u25CF \u25CF \u25CF")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  }, children), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 8,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'center',
      zIndex: 60,
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 134,
      height: 5,
      borderRadius: 100,
      background: 'rgba(14,14,16,0.28)'
    }
  })));
}
window.PhoneFrame = PhoneFrame;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/the-edit-app/PhoneFrame.jsx", error: String((e && e.message) || e) }); }

// ui_kits/the-edit-app/data.js
try { (() => {
/* The Edit — sample catalogue for the UI kit.
   Adapted from the repo prototype's "Soft Romance" edit, recolored
   onto the brighter Impressionist pigment palette. */
window.TE_DATA = {
  aesthetic: 'Soft Romance ’26',
  palette: [{
    key: 'rose',
    color: 'var(--pig-rose)',
    name: 'Rose'
  }, {
    key: 'cadmium',
    color: 'var(--pig-cadmium)',
    name: 'Cadmium'
  }, {
    key: 'clay',
    color: 'var(--pig-tangerine)',
    name: 'Clay'
  }, {
    key: 'viridian',
    color: 'var(--pig-viridian)',
    name: 'Sage'
  }, {
    key: 'cobalt',
    color: 'var(--pig-cobalt)',
    name: 'Ink'
  }, {
    key: 'violet',
    color: 'var(--pig-violet)',
    name: 'Violet'
  }],
  products: [{
    id: 'f1',
    brand: 'Reformation',
    title: 'Linen slip dress',
    cat: 'dresses',
    price: 148,
    was: 198,
    color: 'rose',
    h: 286
  }, {
    id: 'f2',
    brand: 'Djerf Avenue',
    title: 'Cloud knit cardigan',
    cat: 'knitwear',
    price: 120,
    color: 'cadmium',
    h: 224
  }, {
    id: 'f3',
    brand: 'With Jéan',
    title: 'Lace baby tee',
    cat: 'tops',
    price: 59,
    color: 'rose',
    h: 200
  }, {
    id: 'f4',
    brand: 'Ganni',
    title: 'Buckle ballet flat',
    cat: 'shoes',
    price: 245,
    color: 'cobalt',
    h: 182
  }, {
    id: 'f5',
    brand: 'Sézane',
    title: 'Bias silk midi skirt',
    cat: 'skirts',
    price: 135,
    color: 'clay',
    h: 300
  }, {
    id: 'f6',
    brand: 'Aritzia',
    title: 'Effortless trouser',
    cat: 'trousers',
    price: 128,
    color: 'viridian',
    h: 248
  }, {
    id: 'f7',
    brand: 'Reformation',
    title: 'Ruffle wrap blouse',
    cat: 'tops',
    price: 98,
    was: 128,
    color: 'rose',
    h: 262
  }, {
    id: 'f8',
    brand: 'Aritzia',
    title: 'Cropped rib cardigan',
    cat: 'knitwear',
    price: 78,
    color: 'cadmium',
    h: 200
  }, {
    id: 'f9',
    brand: 'Ganni',
    title: 'Floral wrap dress',
    cat: 'dresses',
    price: 295,
    color: 'violet',
    h: 322
  }, {
    id: 'f10',
    brand: 'Sézane',
    title: 'Suede mary janes',
    cat: 'shoes',
    price: 185,
    color: 'clay',
    h: 220
  }, {
    id: 'f11',
    brand: 'Djerf Avenue',
    title: 'Oversized blazer',
    cat: 'outerwear',
    price: 210,
    was: 260,
    color: 'viridian',
    h: 280
  }, {
    id: 'f12',
    brand: 'With Jéan',
    title: 'Satin slip skirt',
    cat: 'skirts',
    price: 72,
    color: 'rose',
    h: 240
  }, {
    id: 'f13',
    brand: 'Aritzia',
    title: 'Contour rib tank',
    cat: 'tops',
    price: 35,
    color: 'cadmium',
    h: 184
  }, {
    id: 'f14',
    brand: 'Ganni',
    title: 'Soft wool beanie',
    cat: 'accessories',
    price: 85,
    color: 'cobalt',
    h: 164
  }],
  boards: [{
    id: 'b1',
    name: 'Soft summer',
    items: ['f1', 'f3', 'f9']
  }, {
    id: 'b2',
    name: 'Office hours',
    items: ['f6', 'f11']
  }],
  following: {
    'Reformation': true,
    'Sézane': true
  }
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/the-edit-app/data.js", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.BoardCard = __ds_scope.BoardCard;

__ds_ns.BrandRow = __ds_scope.BrandRow;

__ds_ns.CanvasSwatch = __ds_scope.CanvasSwatch;

__ds_ns.ProductCard = __ds_scope.ProductCard;

__ds_ns.BottomSheet = __ds_scope.BottomSheet;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.ColorDot = __ds_scope.ColorDot;

__ds_ns.SearchField = __ds_scope.SearchField;

__ds_ns.TabBar = __ds_scope.TabBar;

})();
