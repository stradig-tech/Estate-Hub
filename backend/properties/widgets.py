import json
from django import forms
from django.utils.html import escape
from django.utils.safestring import mark_safe


class AdminCoverPhotoWidget(forms.Widget):
    """
    Renders a dedicated Cover Photo / Thumbnail section with visual preview,
    current cover badge, and a real file upload input with instant client-side preview.
    """
    def __init__(self, attrs=None):
        super().__init__(attrs)
        self.current_cover = None

    def render(self, name, value, attrs=None, renderer=None):
        current_cover = getattr(self, 'current_cover', None)
        if not current_cover and hasattr(self, 'attrs') and self.attrs:
            current_cover = self.attrs.get('current_cover')
        if not current_cover and attrs:
            current_cover = attrs.get('current_cover')
        if not current_cover and value and isinstance(value, str) and value.startswith(('http://', 'https://', '/')):
            current_cover = value

        has_cover = bool(current_cover and str(current_cover).strip())
        cover_src = escape(current_cover) if has_cover else ''

        html = f'''
        <div class="eh-cover-uploader-box" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:16px; margin-bottom:12px; max-width:680px;">
            <div style="display:flex; gap:18px; align-items:flex-start; flex-wrap:wrap;">
                <div id="eh-cover-preview-wrapper" style="width:180px; height:120px; border-radius:8px; border:2px dashed {'#3b82f6' if has_cover else '#cbd5e1'}; background:#ffffff; overflow:hidden; position:relative; display:flex; align-items:center; justify-content:center; flex-shrink:0; box-shadow:0 1px 3px rgba(0,0,0,0.08);">
                    <img id="eh-cover-preview-img" src="{cover_src}" alt="Cover thumbnail" style="width:100%; height:100%; object-fit:cover; display:{'block' if has_cover else 'none'};" />
                    <div id="eh-cover-placeholder" style="text-align:center; color:#94a3b8; font-size:12px; display:{'none' if has_cover else 'block'}; padding:8px;">
                        <i class="fas fa-image" style="font-size:28px; margin-bottom:6px; display:block; color:#cbd5e1;"></i>
                        <span>No cover image</span>
                    </div>
                    <span id="eh-cover-badge" class="badge badge-primary" style="position:absolute; bottom:6px; left:6px; font-size:10px; padding:3px 7px; border-radius:4px; font-weight:600; display:{'inline-block' if has_cover else 'none'};">
                        Cover Thumbnail
                    </span>
                </div>
                <div style="flex:1; min-width:240px;">
                    <h5 style="margin:0 0 6px 0; font-size:14px; font-weight:600; color:#1e293b;">
                        <i class="fas fa-camera text-primary" style="margin-right:6px;"></i>Property Cover Photo (Thumbnail)
                    </h5>
                    <p class="text-muted" style="font-size:12px; margin-bottom:10px; line-height:1.4;">
                        This image is featured as the main listing thumbnail across search results, cards, and maps.
                    </p>
                    <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
                        <label class="btn btn-sm btn-primary" style="cursor:pointer; margin-bottom:0; font-size:12px; font-weight:500; display:inline-flex; align-items:center; gap:6px;">
                            <i class="fas fa-upload"></i> Upload / Replace Cover Photo
                            <input type="file" name="{name}" id="id_{name}" accept="image/*" style="display:none;" onchange="ehPreviewCoverFile(this)" />
                        </label>
                        <button type="button" class="btn btn-sm btn-outline-secondary" onclick="ehClearCoverFile()" id="eh-cover-clear-btn" style="display:none; font-size:12px;">
                            <i class="fas fa-undo"></i> Reset
                        </button>
                    </div>
                    <div id="eh-cover-selected-info" style="display:none; margin-top:8px;">
                        <span class="badge badge-success" style="font-size:11px; padding:4px 8px;">
                            <i class="fas fa-check-circle"></i> <span id="eh-cover-file-name">New photo selected</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <script>
        (function() {{
            var origCoverSrc = "{cover_src}";
            window.ehPreviewCoverFile = function(input) {{
                if (input.files && input.files[0]) {{
                    var file = input.files[0];
                    var reader = new FileReader();
                    reader.onload = function(e) {{
                        var img = document.getElementById('eh-cover-preview-img');
                        var placeholder = document.getElementById('eh-cover-placeholder');
                        var badge = document.getElementById('eh-cover-badge');
                        var info = document.getElementById('eh-cover-selected-info');
                        var fileName = document.getElementById('eh-cover-file-name');
                        var clearBtn = document.getElementById('eh-cover-clear-btn');
                        
                        if (img) {{
                            img.src = e.target.result;
                            img.style.display = 'block';
                        }}
                        if (placeholder) placeholder.style.display = 'none';
                        if (badge) {{
                            badge.style.display = 'inline-block';
                            badge.textContent = 'New Cover (Pending Save)';
                            badge.className = 'badge badge-success';
                        }}
                        if (info) info.style.display = 'block';
                        if (fileName) fileName.textContent = file.name + ' (' + Math.round(file.size / 1024) + ' KB)';
                        if (clearBtn) clearBtn.style.display = 'inline-block';
                    }};
                    reader.readAsDataURL(file);
                }}
            }};
            
            window.ehClearCoverFile = function() {{
                var input = document.getElementById('id_{name}');
                if (input) input.value = '';
                var img = document.getElementById('eh-cover-preview-img');
                var placeholder = document.getElementById('eh-cover-placeholder');
                var badge = document.getElementById('eh-cover-badge');
                var info = document.getElementById('eh-cover-selected-info');
                var clearBtn = document.getElementById('eh-cover-clear-btn');
                
                if (origCoverSrc) {{
                    if (img) {{
                        img.src = origCoverSrc;
                        img.style.display = 'block';
                    }}
                    if (placeholder) placeholder.style.display = 'none';
                    if (badge) {{
                        badge.style.display = 'inline-block';
                        badge.textContent = 'Cover Thumbnail';
                        badge.className = 'badge badge-primary';
                    }}
                }} else {{
                    if (img) {{
                        img.src = '';
                        img.style.display = 'none';
                    }}
                    if (placeholder) placeholder.style.display = 'block';
                    if (badge) badge.style.display = 'none';
                }}
                if (info) info.style.display = 'none';
                if (clearBtn) clearBtn.style.display = 'none';
            }};
        }})();
        </script>
        '''
        return mark_safe(html)


class AdminGalleryWidget(forms.Widget):
    """
    Renders an interactive multi-image gallery with:
    - Server-side pre-rendered photo cards for immediate visibility.
    - Multi-file upload selector (<input type="file" multiple>) with client-side preview cards.
    - Responsive thumbnail preview grid of all existing images.
    - 1-click Delete/Remove button per image with instant DOM removal and JSON synchronization.
    - 'Make Cover' button to promote any image to position #1.
    - 'Add by Image URL' input for external CDN / Unsplash URLs.
    """
    def __init__(self, attrs=None):
        super().__init__(attrs)

    def value_from_datadict(self, data, files, name):
        raw_val = data.get(name)
        if isinstance(raw_val, str) and raw_val.strip():
            return raw_val.strip()
        elif isinstance(raw_val, list):
            return json.dumps(raw_val)
        return '[]'

    def render(self, name, value, attrs=None, renderer=None):
        urls = []
        if isinstance(value, str):
            try:
                parsed = json.loads(value)
                if isinstance(parsed, list):
                    urls = [str(u).strip() for u in parsed if u]
            except Exception:
                urls = []
        elif isinstance(value, list):
            urls = [str(u).strip() for u in value if u]

        json_val = escape(json.dumps(urls))
        urls_json_for_script = json.dumps(urls)

        # Server-side pre-render of initial image cards
        cards_html_list = []
        for idx, url in enumerate(urls):
            is_cover = (idx == 0)
            badge_color = '#2563eb' if is_cover else '#64748b'
            badge_text = '★ Cover' if is_cover else f'#{idx + 1}'
            primary_label = '<span style="font-size:10px; color:#2563eb; font-weight:600;"><i class="fas fa-check"></i> Primary</span>' if is_cover else f'<button type="button" onclick="ehMakeGalleryCover({idx})" style="background:none; border:none; color:#3b82f6; font-size:11px; cursor:pointer; padding:0; font-weight:500;"><i class="fas fa-star text-warning"></i> Set Cover</button>'
            card_html = f'''
            <div class="eh-gallery-card" data-idx="{idx}" style="border:1px solid #e2e8f0; border-radius:8px; overflow:hidden; background:#fff; box-shadow:0 1px 3px rgba(0,0,0,0.06); position:relative; display:flex; flex-direction:column;">
                <div style="position:relative; width:100%; height:110px; background:#f1f5f9; overflow:hidden;">
                    <img src="{escape(url)}" alt="Photo {idx + 1}" style="width:100%; height:100%; object-fit:cover;" />
                    <span style="position:absolute; top:4px; left:4px; background:{badge_color}; color:#fff; font-size:10px; font-weight:600; padding:2px 6px; border-radius:3px;">{badge_text}</span>
                    <button type="button" onclick="ehRemoveGalleryItem({idx})" title="Remove image" style="position:absolute; top:4px; right:4px; background:rgba(220,38,38,0.9); color:#fff; border:none; border-radius:50%; width:22px; height:22px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:11px; padding:0;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div style="padding:6px 8px; display:flex; justify-content:space-between; align-items:center; background:#fafafa; border-top:1px solid #f1f5f9;">
                    {primary_label}
                    <a href="{escape(url)}" target="_blank" rel="noopener noreferrer" style="color:#64748b; font-size:11px;" title="View full image"><i class="fas fa-external-link-alt"></i></a>
                </div>
            </div>
            '''
            cards_html_list.append(card_html)
        cards_html = '\n'.join(cards_html_list)

        html = f'''
        <div class="eh-gallery-widget-container" style="max-width:880px;">
            <!-- Hidden input that holds the synchronized JSON array of images -->
            <input type="hidden" name="{name}" id="id_{name}_json" value="{json_val}" />

            <!-- Multi-file Upload Dropzone / Button -->
            <div class="eh-gallery-upload-zone" style="border:2px dashed #3b82f6; background:#eff6ff; border-radius:10px; padding:20px; text-align:center; margin-bottom:16px; cursor:pointer; transition:all 0.2s ease;" onclick="document.getElementById('id_gallery_upload_files').click()">
                <div style="font-size:32px; color:#3b82f6; margin-bottom:6px;">
                    <i class="fas fa-cloud-upload-alt"></i>
                </div>
                <div style="font-weight:600; font-size:14px; color:#1e293b; margin-bottom:4px;">
                    Click to select multiple photos to upload
                </div>
                <div class="text-muted" style="font-size:12px;">
                    Select multiple files at once (JPG, PNG, WEBP, GIF). They will be uploaded and added to the gallery.
                </div>
                <input type="file" name="gallery_upload_files" id="id_gallery_upload_files" multiple accept="image/*" style="display:none;" onchange="ehHandleGalleryFiles(this)" />
            </div>

            <!-- Previews of newly selected files before saving -->
            <div id="eh-gallery-new-section" style="display:none; margin-bottom:18px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:12px;">
                <div style="font-weight:600; font-size:13px; color:#166534; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
                    <span><i class="fas fa-sparkles"></i> Newly Selected Photos (<span id="eh-gallery-new-count">0</span>) — Will be uploaded when you Save</span>
                    <button type="button" class="btn btn-xs btn-outline-danger" onclick="ehClearSelectedGalleryFiles()" style="font-size:11px; padding:2px 6px;">Clear new</button>
                </div>
                <div id="eh-gallery-new-grid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(110px, 1fr)); gap:10px;"></div>
            </div>

            <!-- Header + Quick Add URL Bar -->
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:8px;">
                <div style="font-weight:600; font-size:13px; color:#334155;">
                    <i class="fas fa-images text-primary" style="margin-right:4px;"></i> Current Gallery (<span id="eh-gallery-count">{len(urls)}</span> photos)
                </div>
                <div style="display:flex; gap:6px; align-items:center;">
                    <input type="text" id="eh-gallery-url-input" placeholder="Or paste external image URL..." class="form-control form-control-sm" style="width:240px; font-size:12px; height:28px;" />
                    <button type="button" class="btn btn-sm btn-outline-primary" onclick="ehAddGalleryUrl()" style="font-size:12px; padding:2px 8px; height:28px;">
                        <i class="fas fa-plus"></i> Add URL
                    </button>
                </div>
            </div>

            <!-- Existing Photos Grid -->
            <div id="eh-gallery-grid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(140px, 1fr)); gap:12px; margin-bottom:14px;">
                {cards_html}
            </div>
            
            <div id="eh-gallery-empty" style="display:{'none' if urls else 'block'}; padding:30px; text-align:center; background:#f8fafc; border:1px dashed #cbd5e1; border-radius:8px; color:#94a3b8; font-size:13px;">
                <i class="fas fa-images" style="font-size:32px; display:block; margin-bottom:6px; color:#cbd5e1;"></i>
                No gallery photos added yet. Use the upload box above or paste image URLs.
            </div>
        </div>

        <script>
        (function() {{
            var galleryUrls = {urls_json_for_script};
            
            function escapeHtml(str) {{
                return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            }}

            function syncGalleryInput() {{
                var input = document.getElementById('id_{name}_json');
                if (input) input.value = JSON.stringify(galleryUrls);
                var countSpan = document.getElementById('eh-gallery-count');
                if (countSpan) countSpan.textContent = galleryUrls.length;
                var emptyNotice = document.getElementById('eh-gallery-empty');
                if (emptyNotice) emptyNotice.style.display = galleryUrls.length === 0 ? 'block' : 'none';
            }}
            
            window.ehRenderGalleryGrid = function() {{
                var grid = document.getElementById('eh-gallery-grid');
                if (!grid) return;
                grid.innerHTML = '';
                
                galleryUrls.forEach(function(url, idx) {{
                    var card = document.createElement('div');
                    card.style.cssText = 'border:1px solid #e2e8f0; border-radius:8px; overflow:hidden; background:#fff; box-shadow:0 1px 3px rgba(0,0,0,0.06); position:relative; display:flex; flex-direction:column;';
                    
                    var isCover = (idx === 0);
                    var badgeColor = isCover ? '#2563eb' : '#64748b';
                    var badgeText = isCover ? '★ Cover' : '#' + (idx + 1);
                    var safeUrl = escapeHtml(url);
                    
                    var actionHtml = isCover
                        ? '<span style="font-size:10px; color:#2563eb; font-weight:600;"><i class="fas fa-check"></i> Primary</span>'
                        : '<button type="button" onclick="ehMakeGalleryCover(' + idx + ')" style="background:none; border:none; color:#3b82f6; font-size:11px; cursor:pointer; padding:0; font-weight:500;"><i class="fas fa-star text-warning"></i> Set Cover</button>';
                    
                    card.innerHTML = 
                        '<div style="position:relative; width:100%; height:110px; background:#f1f5f9; overflow:hidden;">' +
                            '<img src="' + safeUrl + '" style="width:100%; height:100%; object-fit:cover;" />' +
                            '<span style="position:absolute; top:4px; left:4px; background:' + badgeColor + '; color:#fff; font-size:10px; font-weight:600; padding:2px 6px; border-radius:3px;">' + badgeText + '</span>' +
                            '<button type="button" onclick="ehRemoveGalleryItem(' + idx + ')" title="Remove image" style="position:absolute; top:4px; right:4px; background:rgba(220,38,38,0.9); color:#fff; border:none; border-radius:50%; width:22px; height:22px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:11px; padding:0;">' +
                                '<i class="fas fa-times"></i>' +
                            '</button>' +
                        '</div>' +
                        '<div style="padding:6px 8px; display:flex; justify-content:space-between; align-items:center; background:#fafafa; border-top:1px solid #f1f5f9;">' +
                            actionHtml +
                            '<a href="' + safeUrl + '" target="_blank" rel="noopener noreferrer" style="color:#64748b; font-size:11px;" title="View full image"><i class="fas fa-external-link-alt"></i></a>' +
                        '</div>';
                    grid.appendChild(card);
                }});
                syncGalleryInput();
            }};
            
            window.ehRemoveGalleryItem = function(idx) {{
                if (confirm('Remove this photo from the gallery?')) {{
                    galleryUrls.splice(idx, 1);
                    ehRenderGalleryGrid();
                }}
            }};
            
            window.ehMakeGalleryCover = function(idx) {{
                var item = galleryUrls.splice(idx, 1)[0];
                galleryUrls.unshift(item);
                ehRenderGalleryGrid();
                // Also update the cover photo preview if present
                var coverImg = document.getElementById('eh-cover-preview-img');
                var coverPlaceholder = document.getElementById('eh-cover-placeholder');
                var coverBadge = document.getElementById('eh-cover-badge');
                if (coverImg && item) {{
                    coverImg.src = item;
                    coverImg.style.display = 'block';
                    if (coverPlaceholder) coverPlaceholder.style.display = 'none';
                    if (coverBadge) coverBadge.style.display = 'inline-block';
                }}
            }};
            
            window.ehAddGalleryUrl = function() {{
                var input = document.getElementById('eh-gallery-url-input');
                var val = (input.value || '').trim();
                if (!val) return;
                if (!val.startsWith('http://') && !val.startsWith('https://') && !val.startsWith('/')) {{
                    alert('Please enter a valid URL starting with http://, https://, or /');
                    return;
                }}
                galleryUrls.push(val);
                input.value = '';
                ehRenderGalleryGrid();
            }};
            
            window.ehHandleGalleryFiles = function(input) {{
                var section = document.getElementById('eh-gallery-new-section');
                var grid = document.getElementById('eh-gallery-new-grid');
                var countSpan = document.getElementById('eh-gallery-new-count');
                if (!input.files || input.files.length === 0) return;
                
                grid.innerHTML = '';
                section.style.display = 'block';
                countSpan.textContent = input.files.length;
                
                Array.from(input.files).forEach(function(file) {{
                    var reader = new FileReader();
                    reader.onload = function(e) {{
                        var card = document.createElement('div');
                        card.style.cssText = 'border:1px solid #bbf7d0; border-radius:6px; overflow:hidden; background:#fff;';
                        card.innerHTML = 
                            '<div style="width:100%; height:75px; background:#f0fdf4; overflow:hidden;">' +
                                '<img src="' + e.target.result + '" style="width:100%; height:100%; object-fit:cover;" />' +
                            '</div>' +
                            '<div style="padding:4px 6px; font-size:10px; color:#166534; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">' +
                                escapeHtml(file.name) +
                            '</div>';
                        grid.appendChild(card);
                    }};
                    reader.readAsDataURL(file);
                }});
            }};
            
            window.ehClearSelectedGalleryFiles = function() {{
                var input = document.getElementById('id_gallery_upload_files');
                if (input) input.value = '';
                var section = document.getElementById('eh-gallery-new-section');
                if (section) section.style.display = 'none';
            }};
        }})();
        </script>
        '''
        return mark_safe(html)


class AdminFloorPlansWidget(forms.Widget):
    """
    Renders an interactive multi-floor plan manager with:
    - Server-side pre-rendered blueprint cards for immediate visibility.
    - Multi-file upload selector (<input type="file" multiple>) for floor plan blueprints.
    - Instant client-side preview cards of selected files.
    - Visual grid of existing floor plan diagrams with #1 (Primary) badge and delete button.
    - Add floor plan by URL option.
    - Synchronized hidden JSON input for persistence.
    """
    def __init__(self, attrs=None):
        super().__init__(attrs)

    def value_from_datadict(self, data, files, name):
        raw_val = data.get(name)
        if isinstance(raw_val, str) and raw_val.strip():
            return raw_val.strip()
        elif isinstance(raw_val, list):
            return json.dumps(raw_val)
        return '[]'

    def render(self, name, value, attrs=None, renderer=None):
        urls = []
        if isinstance(value, str):
            try:
                parsed = json.loads(value)
                if isinstance(parsed, list):
                    urls = [str(u).strip() for u in parsed if u]
            except Exception:
                urls = []
        elif isinstance(value, list):
            urls = [str(u).strip() for u in value if u]

        json_val = escape(json.dumps(urls))
        urls_json_for_script = json.dumps(urls)

        # Server-side pre-render of initial floor plan cards
        cards_html_list = []
        for idx, url in enumerate(urls):
            is_primary = (idx == 0)
            badge_color = '#0284c7' if is_primary else '#0369a1'
            badge_text = '★ Primary Floor Plan' if is_primary else f'Plan #{idx + 1}'
            primary_label = '<span style="font-size:10px; color:#0284c7; font-weight:600;"><i class="fas fa-check"></i> Main Diagram</span>' if is_primary else f'<button type="button" onclick="ehMakePrimaryFloorPlan({idx})" style="background:none; border:none; color:#0284c7; font-size:11px; cursor:pointer; padding:0; font-weight:500;"><i class="fas fa-star text-warning"></i> Set Primary</button>'
            card_html = f'''
            <div class="eh-floorplan-card" data-idx="{idx}" style="border:1px solid #bae6fd; border-radius:8px; overflow:hidden; background:#fff; box-shadow:0 1px 3px rgba(0,0,0,0.06); position:relative; display:flex; flex-direction:column;">
                <div style="position:relative; width:100%; height:130px; background:#f8fafc; overflow:hidden; display:flex; align-items:center; justify-content:center;">
                    <img src="{escape(url)}" alt="Floor plan {idx + 1}" style="width:100%; height:100%; object-fit:contain; background:#ffffff;" />
                    <span style="position:absolute; top:4px; left:4px; background:{badge_color}; color:#fff; font-size:10px; font-weight:600; padding:2px 6px; border-radius:3px;">{badge_text}</span>
                    <button type="button" onclick="ehRemoveFloorPlanItem({idx})" title="Remove floor plan" style="position:absolute; top:4px; right:4px; background:rgba(220,38,38,0.9); color:#fff; border:none; border-radius:50%; width:22px; height:22px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:11px; padding:0;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div style="padding:6px 8px; display:flex; justify-content:space-between; align-items:center; background:#f0f9ff; border-top:1px solid #e0f2fe;">
                    {primary_label}
                    <a href="{escape(url)}" target="_blank" rel="noopener noreferrer" style="color:#0284c7; font-size:11px;" title="View full blueprint"><i class="fas fa-search-plus"></i> View</a>
                </div>
            </div>
            '''
            cards_html_list.append(card_html)
        cards_html = '\n'.join(cards_html_list)

        html = f'''
        <div class="eh-floorplan-widget-container" style="max-width:880px;">
            <!-- Hidden input that holds the synchronized JSON array of floor plans -->
            <input type="hidden" name="{name}" id="id_{name}_json" value="{json_val}" />

            <!-- Multi-file Upload Dropzone / Button -->
            <div class="eh-floorplan-upload-zone" style="border:2px dashed #0284c7; background:#f0f9ff; border-radius:10px; padding:20px; text-align:center; margin-bottom:16px; cursor:pointer; transition:all 0.2s ease;" onclick="document.getElementById('id_floor_plan_upload_files').click()">
                <div style="font-size:32px; color:#0284c7; margin-bottom:6px;">
                    <i class="fas fa-drafting-compass"></i>
                </div>
                <div style="font-weight:600; font-size:14px; color:#0f172a; margin-bottom:4px;">
                    Click to select floor plan diagram(s) to upload (Multi)
                </div>
                <div class="text-muted" style="font-size:12px;">
                    Upload 2D/3D layouts, architectural blueprints, level 1 / level 2 schematics (JPG, PNG, SVG, WEBP).
                </div>
                <input type="file" name="floor_plan_upload_files" id="id_floor_plan_upload_files" multiple accept="image/*" style="display:none;" onchange="ehHandleFloorPlanFiles(this)" />
            </div>

            <!-- Previews of newly selected floor plans before saving -->
            <div id="eh-floorplan-new-section" style="display:none; margin-bottom:18px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:12px;">
                <div style="font-weight:600; font-size:13px; color:#166534; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
                    <span><i class="fas fa-check-circle"></i> Newly Selected Floor Plans (<span id="eh-floorplan-new-count">0</span>) — Will be uploaded when you Save</span>
                    <button type="button" class="btn btn-xs btn-outline-danger" onclick="ehClearSelectedFloorPlanFiles()" style="font-size:11px; padding:2px 6px;">Clear new</button>
                </div>
                <div id="eh-floorplan-new-grid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(130px, 1fr)); gap:10px;"></div>
            </div>

            <!-- Header + Quick Add URL Bar -->
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:8px;">
                <div style="font-weight:600; font-size:13px; color:#334155;">
                    <i class="fas fa-layer-group text-info" style="margin-right:4px;"></i> Current Floor Plans (<span id="eh-floorplan-count">{len(urls)}</span> diagrams)
                </div>
                <div style="display:flex; gap:6px; align-items:center;">
                    <input type="text" id="eh-floorplan-url-input" placeholder="Or paste floor plan image URL..." class="form-control form-control-sm" style="width:240px; font-size:12px; height:28px;" />
                    <button type="button" class="btn btn-sm btn-outline-info" onclick="ehAddFloorPlanUrl()" style="font-size:12px; padding:2px 8px; height:28px;">
                        <i class="fas fa-plus"></i> Add URL
                    </button>
                </div>
            </div>

            <!-- Existing Floor Plans Grid -->
            <div id="eh-floorplan-grid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(180px, 1fr)); gap:12px; margin-bottom:14px;">
                {cards_html}
            </div>
            
            <div id="eh-floorplan-empty" style="display:{'none' if urls else 'block'}; padding:28px; text-align:center; background:#f8fafc; border:1px dashed #cbd5e1; border-radius:8px; color:#94a3b8; font-size:13px;">
                <i class="fas fa-drafting-compass" style="font-size:30px; display:block; margin-bottom:6px; color:#cbd5e1;"></i>
                No floor plans uploaded yet. Click the upload box above to add diagrams.
            </div>
        </div>

        <script>
        (function() {{
            var floorPlanUrls = {urls_json_for_script};
            
            function escapeHtml(str) {{
                return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            }}

            function syncFloorPlanInput() {{
                var input = document.getElementById('id_{name}_json');
                if (input) input.value = JSON.stringify(floorPlanUrls);
                var countSpan = document.getElementById('eh-floorplan-count');
                if (countSpan) countSpan.textContent = floorPlanUrls.length;
                var emptyNotice = document.getElementById('eh-floorplan-empty');
                if (emptyNotice) emptyNotice.style.display = floorPlanUrls.length === 0 ? 'block' : 'none';
            }}
            
            window.ehRenderFloorPlanGrid = function() {{
                var grid = document.getElementById('eh-floorplan-grid');
                if (!grid) return;
                grid.innerHTML = '';
                
                floorPlanUrls.forEach(function(url, idx) {{
                    var card = document.createElement('div');
                    card.style.cssText = 'border:1px solid #bae6fd; border-radius:8px; overflow:hidden; background:#fff; box-shadow:0 1px 3px rgba(0,0,0,0.06); position:relative; display:flex; flex-direction:column;';
                    
                    var isPrimary = (idx === 0);
                    var badgeColor = isPrimary ? '#0284c7' : '#0369a1';
                    var badgeText = isPrimary ? '★ Primary Floor Plan' : 'Plan #' + (idx + 1);
                    var safeUrl = escapeHtml(url);
                    
                    var actionHtml = isPrimary
                        ? '<span style="font-size:10px; color:#0284c7; font-weight:600;"><i class="fas fa-check"></i> Main Diagram</span>'
                        : '<button type="button" onclick="ehMakePrimaryFloorPlan(' + idx + ')" style="background:none; border:none; color:#0284c7; font-size:11px; cursor:pointer; padding:0; font-weight:500;"><i class="fas fa-star text-warning"></i> Set Primary</button>';
                    
                    card.innerHTML = 
                        '<div style="position:relative; width:100%; height:130px; background:#f8fafc; overflow:hidden; display:flex; align-items:center; justify-content:center;">' +
                            '<img src="' + safeUrl + '" style="width:100%; height:100%; object-fit:contain; background:#ffffff;" />' +
                            '<span style="position:absolute; top:4px; left:4px; background:' + badgeColor + '; color:#fff; font-size:10px; font-weight:600; padding:2px 6px; border-radius:3px;">' + badgeText + '</span>' +
                            '<button type="button" onclick="ehRemoveFloorPlanItem(' + idx + ')" title="Remove floor plan" style="position:absolute; top:4px; right:4px; background:rgba(220,38,38,0.9); color:#fff; border:none; border-radius:50%; width:22px; height:22px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:11px; padding:0;">' +
                                '<i class="fas fa-times"></i>' +
                            '</button>' +
                        '</div>' +
                        '<div style="padding:6px 8px; display:flex; justify-content:space-between; align-items:center; background:#f0f9ff; border-top:1px solid #e0f2fe;">' +
                            actionHtml +
                            '<a href="' + safeUrl + '" target="_blank" rel="noopener noreferrer" style="color:#0284c7; font-size:11px;" title="View full blueprint"><i class="fas fa-search-plus"></i> View</a>' +
                        '</div>';
                    grid.appendChild(card);
                }});
                syncFloorPlanInput();
            }};
            
            window.ehRemoveFloorPlanItem = function(idx) {{
                if (confirm('Remove this floor plan diagram?')) {{
                    floorPlanUrls.splice(idx, 1);
                    ehRenderFloorPlanGrid();
                }}
            }};
            
            window.ehMakePrimaryFloorPlan = function(idx) {{
                var item = floorPlanUrls.splice(idx, 1)[0];
                floorPlanUrls.unshift(item);
                ehRenderFloorPlanGrid();
            }};
            
            window.ehAddFloorPlanUrl = function() {{
                var input = document.getElementById('eh-floorplan-url-input');
                var val = (input.value || '').trim();
                if (!val) return;
                if (!val.startsWith('http://') && !val.startsWith('https://') && !val.startsWith('/')) {{
                    alert('Please enter a valid URL starting with http://, https://, or /');
                    return;
                }}
                floorPlanUrls.push(val);
                input.value = '';
                ehRenderFloorPlanGrid();
            }};
            
            window.ehHandleFloorPlanFiles = function(input) {{
                var section = document.getElementById('eh-floorplan-new-section');
                var grid = document.getElementById('eh-floorplan-new-grid');
                var countSpan = document.getElementById('eh-floorplan-new-count');
                if (!input.files || input.files.length === 0) return;
                
                grid.innerHTML = '';
                section.style.display = 'block';
                countSpan.textContent = input.files.length;
                
                Array.from(input.files).forEach(function(file) {{
                    var reader = new FileReader();
                    reader.onload = function(e) {{
                        var card = document.createElement('div');
                        card.style.cssText = 'border:1px solid #bbf7d0; border-radius:6px; overflow:hidden; background:#fff;';
                        card.innerHTML = 
                            '<div style="width:100%; height:85px; background:#f0fdf4; overflow:hidden; display:flex; align-items:center; justify-content:center;">' +
                                '<img src="' + e.target.result + '" style="width:100%; height:100%; object-fit:contain;" />' +
                            '</div>' +
                            '<div style="padding:4px 6px; font-size:10px; color:#166534; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">' +
                                escapeHtml(file.name) +
                            '</div>';
                        grid.appendChild(card);
                    }};
                    reader.readAsDataURL(file);
                }});
            }};
            
            window.ehClearSelectedFloorPlanFiles = function() {{
                var input = document.getElementById('id_floor_plan_upload_files');
                if (input) input.value = '';
                var section = document.getElementById('eh-floorplan-new-section');
                if (section) section.style.display = 'none';
            }};
        }})();
        </script>
        '''
        return mark_safe(html)


class AdminAmenitiesWidget(forms.Widget):
    """
    Renders an interactive amenities selector with:
    - Clickable badge pills with checkmarks for standard and custom amenities.
    - Active visual state for selected amenities.
    - 'Add Custom Amenity' input for rapid custom feature tags.
    - Synchronized hidden JSON input for persistence.
    """
    ALL_COMMON_AMENITIES = [
        'Pool', 'Gym', 'Garage', 'Garden', 'Air Conditioning', 'Heating',
        'Wifi', 'Furnished', 'Pet Friendly', 'Balcony', 'Security System', 'Fireplace',
        'Parking', 'Elevator', 'Laundry', 'Dishwasher', 'Solar Panels', 'Smart Home',
        'High Ceilings', 'Washer/Dryer', 'Doorman'
    ]

    def __init__(self, attrs=None):
        super().__init__(attrs)

    def value_from_datadict(self, data, files, name):
        raw_val = data.get(name)
        if isinstance(raw_val, str) and raw_val.strip():
            return raw_val.strip()
        elif isinstance(raw_val, list):
            return json.dumps(raw_val)
        return '[]'

    def render(self, name, value, attrs=None, renderer=None):
        selected = []
        if isinstance(value, str):
            try:
                parsed = json.loads(value)
                if isinstance(parsed, list):
                    selected = [str(a).strip() for a in parsed if a]
            except Exception:
                selected = []
        elif isinstance(value, list):
            selected = [str(a).strip() for a in value if a]

        # Combine all standard options with any custom options already selected
        all_options = list(self.ALL_COMMON_AMENITIES)
        for item in selected:
            if item not in all_options:
                all_options.append(item)

        json_val = escape(json.dumps(selected))
        selected_json = json.dumps(selected)

        # Server-side badges
        badges_html = []
        for opt in all_options:
            is_active = opt in selected
            opt_escaped = escape(opt)
            bg = '#2563eb' if is_active else '#f1f5f9'
            color = '#ffffff' if is_active else '#334155'
            border = '#2563eb' if is_active else '#cbd5e1'
            icon = '<i class="fas fa-check-circle" style="margin-right:4px;"></i>' if is_active else '<i class="far fa-circle" style="margin-right:4px; color:#94a3b8;"></i>'
            badge = f'''
            <span class="eh-amenity-pill" data-amenity="{opt_escaped}" onclick="ehToggleAmenity('{opt_escaped}')" style="cursor:pointer; display:inline-flex; align-items:center; padding:5px 12px; border-radius:20px; font-size:12px; font-weight:500; background:{bg}; color:{color}; border:1px solid {border}; user-select:none; transition:all 0.15s ease;">
                {icon}<span>{opt_escaped}</span>
            </span>
            '''
            badges_html.append(badge)

        rendered_badges = '\n'.join(badges_html)

        html = f'''
        <div class="eh-amenities-widget-container" style="max-width:880px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:16px;">
            <input type="hidden" name="{name}" id="id_{name}_json" value="{json_val}" />

            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
                <div style="font-weight:600; font-size:13px; color:#1e293b;">
                    <i class="fas fa-tags text-primary" style="margin-right:4px;"></i> Select Features & Amenities (<span id="eh-amenities-count">{len(selected)}</span> selected)
                </div>
                <div style="display:flex; gap:6px; align-items:center;">
                    <input type="text" id="eh-custom-amenity-input" placeholder="Add custom amenity..." class="form-control form-control-sm" style="width:200px; font-size:12px; height:28px;" onkeydown="if(event.key==='Enter'){{event.preventDefault(); ehAddCustomAmenity();}}" />
                    <button type="button" class="btn btn-sm btn-outline-primary" onclick="ehAddCustomAmenity()" style="font-size:12px; padding:2px 8px; height:28px;">
                        <i class="fas fa-plus"></i> Add
                    </button>
                </div>
            </div>

            <div id="eh-amenities-pills-wrapper" style="display:flex; flex-wrap:wrap; gap:8px;">
                {rendered_badges}
            </div>
        </div>

        <script>
        (function() {{
            var selectedAmenities = {selected_json};

            function syncAmenitiesInput() {{
                var input = document.getElementById('id_{name}_json');
                if (input) input.value = JSON.stringify(selectedAmenities);
                var countSpan = document.getElementById('eh-amenities-count');
                if (countSpan) countSpan.textContent = selectedAmenities.length;
            }}

            window.ehToggleAmenity = function(item) {{
                var idx = selectedAmenities.indexOf(item);
                if (idx > -1) {{
                    selectedAmenities.splice(idx, 1);
                }} else {{
                    selectedAmenities.push(item);
                }}
                
                // Update clicked badge styles directly in DOM
                var pills = document.querySelectorAll('.eh-amenity-pill');
                pills.forEach(function(pill) {{
                    if (pill.getAttribute('data-amenity') === item) {{
                        var isNowActive = selectedAmenities.indexOf(item) > -1;
                        pill.style.background = isNowActive ? '#2563eb' : '#f1f5f9';
                        pill.style.color = isNowActive ? '#ffffff' : '#334155';
                        pill.style.borderColor = isNowActive ? '#2563eb' : '#cbd5e1';
                        pill.innerHTML = (isNowActive ? '<i class="fas fa-check-circle" style="margin-right:4px;"></i>' : '<i class="far fa-circle" style="margin-right:4px; color:#94a3b8;"></i>') + '<span>' + item + '</span>';
                    }}
                }});
                syncAmenitiesInput();
            }};

            window.ehAddCustomAmenity = function() {{
                var input = document.getElementById('eh-custom-amenity-input');
                var val = (input.value || '').trim();
                if (!val) return;
                
                if (selectedAmenities.indexOf(val) === -1) {{
                    selectedAmenities.push(val);
                }}
                
                var wrapper = document.getElementById('eh-amenities-pills-wrapper');
                var existing = wrapper.querySelector('.eh-amenity-pill[data-amenity="' + val + '"]');
                if (!existing) {{
                    var span = document.createElement('span');
                    span.className = 'eh-amenity-pill';
                    span.setAttribute('data-amenity', val);
                    span.onclick = function() {{ ehToggleAmenity(val); }};
                    span.style.cssText = 'cursor:pointer; display:inline-flex; align-items:center; padding:5px 12px; border-radius:20px; font-size:12px; font-weight:500; background:#2563eb; color:#ffffff; border:1px solid #2563eb; user-select:none; transition:all 0.15s ease;';
                    span.innerHTML = '<i class="fas fa-check-circle" style="margin-right:4px;"></i><span>' + val + '</span>';
                    wrapper.appendChild(span);
                }} else {{
                    existing.style.background = '#2563eb';
                    existing.style.color = '#ffffff';
                    existing.style.borderColor = '#2563eb';
                    existing.innerHTML = '<i class="fas fa-check-circle" style="margin-right:4px;"></i><span>' + val + '</span>';
                }}
                input.value = '';
                syncAmenitiesInput();
            }};
        }})();
        </script>
        '''
        return mark_safe(html)
