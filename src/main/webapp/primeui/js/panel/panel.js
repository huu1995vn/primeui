/**
 * PrimeUI Panel Widget
 */
(function() {

    $.widget("primeui.puipanel", {
       
        options: {
            toggleable: false,
            toggleDuration: 'normal',
            toggleOrientation : 'vertical',
            collapsed: false,
            closable: false,
            closeDuration: 'slow',
            title: null,
            enhanced: false
        },
        
        _create: function() {
            if(!this.options.enhanced) {
                this.element.addClass('pui-panel ui-widget ui-widget-content ui-corner-all')
                    .contents().wrapAll('<div class="pui-panel-content ui-widget-content" />');

                var title = this.element.attr('title')||this.options.title;
                if(title) {
                    this.element.prepend('<div class="pui-panel-titlebar ui-widget-header ui-helper-clearfix ui-corner-all"><span class="ui-panel-title">' +
                            title + "</span></div>").removeAttr('title');
                }
            }
                
            this.header = this.element.children('div.pui-panel-titlebar');
            this.title = this.header.children('span.ui-panel-title');
            this.content = this.element.children('div.pui-panel-content');
            
            var $this = this;
            
            if(this.options.closable) {
                if(!this.options.enhanced) {
                    this.closer = $('<a class="pui-panel-titlebar-icon pui-panel-titlebar-closer ui-corner-all ui-state-default" href="#"><span class="pui-icon fa fa-fw fa-close"></span></a>')
                                .appendTo(this.header);
                }
                else {
                    this.closer = this.header.children('.pui-panel-titlebar-closer');
                }

                this.closer.on('click.puipanel', function(e) {
                    $this.close();
                    e.preventDefault();
                });
            }
            
            if(this.options.toggleable) {
                var icon = this.options.collapsed ? 'fa-plus' : 'fa-minus';
                
                if(!this.options.enhanced) {
                    this.toggler = $('<a class="pui-panel-titlebar-icon pui-panel-titlebar-toggler ui-corner-all ui-state-default" href="#"><span class="pui-icon fa fa-fw ' + icon + '"></span></a>')
                                .appendTo(this.header);
                }
                else {
                    this.toggler = this.header.children('.pui-panel-titlebar-toggler');
                    this.toggler.children('.pui-icon').addClass(icon);
                }
                
                this.toggler.on('click.puipanel', function(e) {
                    $this.toggle();
                    e.preventDefault();
                });
                                
                if(this.options.collapsed) {
                    this.content.hide();
                }
            }
            
            this._bindEvents();
        },

        _bindEvents: function() {
            this.header.children('a.pui-panel-titlebar-icon').on('mouseenter.puipanel', function() {
                $(this).addClass('ui-state-hover');
            })
            .on('mouseleave.puipanel', function() {
                $(this).removeClass('ui-state-hover');
            });
        },

        _unbindEvents: function() {
            this.header.children('a.pui-panel-titlebar-icon').off();
        },
        
        close: function() {
            var $this = this;
            
            this._trigger('beforeClose', null);
            
            this.element.fadeOut(this.options.closeDuration,
                function() {
                    $this._trigger('afterClose', null);
                }
            );
        },
        
        toggle: function() {
            if(this.options.collapsed) {
                this.expand();
            }
            else {
                this.collapse();
            }
        },
        
        expand: function() {
            this.toggler.children('.pui-icon').removeClass('fa-plus').addClass('fa-minus');
            
            if(this.options.toggleOrientation === 'vertical') {
                this._slideDown();
            } 
            else if(this.options.toggleOrientation === 'horizontal') {
                this._slideRight();
            }
        },

        collapse: function() {
            this.toggler.children('.pui-icon').removeClass('fa-minus').addClass('fa-plus');
            
            if(this.options.toggleOrientation === 'vertical') {
                this._slideUp();
            } 
            else if(this.options.toggleOrientation === 'horizontal') {
                this._slideLeft();
            }
        },
        
        _slideUp: function() {        
            var $this = this;
            
            this._trigger('beforeCollapse');
            
            this.content.slideUp(this.options.toggleDuration, 'easeInOutCirc', function() {
                $this._trigger('afterCollapse');
                $this.options.collapsed = !$this.options.collapsed;
            });
        },

        _slideDown: function() {  
            var $this = this;
            
            this._trigger('beforeExpand');
            
            this.content.slideDown(this.options.toggleDuration, 'easeInOutCirc', function() {
                $this._trigger('afterExpand');
                $this.options.collapsed = !$this.options.collapsed;
            }); 
        },

        _slideLeft: function() {
            var $this = this;

            this.originalWidth = this.element.width();

            this.title.hide();
            this.toggler.hide();
            this.content.hide();

            this.element.animate({
                width: '42px'
            }, this.options.toggleSpeed, 'easeInOutCirc', function() {
                $this.toggler.show();
                $this.element.addClass('pui-panel-collapsed-h');
                $this.options.collapsed = !$this.options.collapsed;
            });
        },

        _slideRight: function() {
            var $this = this,
            expandWidth = this.originalWidth||'100%';

            this.toggler.hide();

            this.element.animate({
                width: expandWidth
            }, this.options.toggleSpeed, 'easeInOutCirc', function() {
                $this.element.removeClass('pui-panel-collapsed-h');
                $this.title.show();
                $this.toggler.show();
                $this.options.collapsed = !$this.options.collapsed;

                $this.content.css({
                    'visibility': 'visible',
                    'display': 'block',
                    'height': 'auto'
                });
            });
        },

        _destroy: function() {
            this._unbindEvents();
            if(this.toggler) {
                this.toggler.children('.pui-icon').removeClass('fa-minus fa-plus');
            }
        }
    });
})();