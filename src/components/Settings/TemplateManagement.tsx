import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Edit, Trash2, Copy, FileText, Star } from 'lucide-react';
import { toast } from 'sonner';
import type { ReportTemplate, TemplateType } from '../../types';

const TemplateManagement = () => {
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState<TemplateType>('weekly');
  const [formContent, setFormContent] = useState('');

  // Load templates on mount
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      const result = await invoke<ReportTemplate[]>('list_templates');
      setTemplates(result);
    } catch (err) {
      console.error('Failed to load templates:', err);
      toast.error('加载模板失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTemplate = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    setIsEditing(false);
    setIsCreating(false);
    setFormName(template.name);
    setFormType(template.type);
    setFormContent(template.content);
  };

  const handleCreateNew = () => {
    setSelectedTemplate(null);
    setIsCreating(true);
    setIsEditing(false);
    setFormName('');
    setFormType('weekly'); // Default to weekly
    setFormContent('');
  };

  const handleEdit = () => {
    if (!selectedTemplate) return;
    if (selectedTemplate.isBuiltin) {
      toast.error('内置模板不可编辑，请复制后修改');
      return;
    }
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleCopy = () => {
    if (!selectedTemplate) return;
    setIsCreating(true);
    setIsEditing(false);
    setFormName(`${selectedTemplate.name} (副本)`);
    setFormType(selectedTemplate.type);
    setFormContent(selectedTemplate.content);
    setSelectedTemplate(null);
  };

  const handleSave = async () => {
    if (!formName.trim() || !formContent.trim()) {
      toast.error('模板名称和内容不能为空');
      return;
    }

    try {
      if (isCreating) {
        // Create new template
        const newTemplate = await invoke<ReportTemplate>('create_template', {
          name: formName,
          templateType: formType,
          content: formContent,
        });
        toast.success('模板创建成功');
        setTemplates([newTemplate, ...templates]);
        setSelectedTemplate(newTemplate);
        setIsCreating(false);
      } else if (isEditing && selectedTemplate) {
        // Update existing template
        const updatedTemplate = await invoke<ReportTemplate>('update_template', {
          id: selectedTemplate.id,
          name: formName !== selectedTemplate.name ? formName : null,
          content: formContent !== selectedTemplate.content ? formContent : null,
        });
        toast.success('模板更新成功');
        setTemplates(templates.map((t) => (t.id === updatedTemplate.id ? updatedTemplate : t)));
        setSelectedTemplate(updatedTemplate);
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Failed to save template:', err);
      toast.error(`保存失败: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleDelete = async () => {
    if (!selectedTemplate) return;
    if (selectedTemplate.isBuiltin) {
      toast.error('内置模板不可删除');
      return;
    }

    if (!confirm(`确定要删除模板 "${selectedTemplate.name}" 吗？`)) {
      return;
    }

    try {
      await invoke('delete_template', { id: selectedTemplate.id });
      toast.success('模板删除成功');
      setTemplates(templates.filter((t) => t.id !== selectedTemplate.id));
      setSelectedTemplate(null);
      setFormName('');
      setFormContent('');
    } catch (err) {
      console.error('Failed to delete template:', err);
      toast.error(`删除失败: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleCancel = () => {
    if (selectedTemplate) {
      setFormName(selectedTemplate.name);
      setFormType(selectedTemplate.type);
      setFormContent(selectedTemplate.content);
    } else {
      setFormName('');
      setFormType('weekly');
      setFormContent('');
    }
    setIsEditing(false);
    setIsCreating(false);
  };

  const handleSetDefault = async (template: ReportTemplate) => {
    try {
      await invoke('set_default_template', { id: template.id });
      toast.success(`已将 "${template.name}" 设置为默认模板`);
      // Reload templates to update the isDefault flag
      await loadTemplates();
    } catch (err) {
      console.error('Failed to set default template:', err);
      toast.error(`设置失败: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const getTemplateTypeLabel = (type: string) => {
    switch (type) {
      case 'weekly':
        return '周报';
      case 'monthly':
        return '月报';
      case 'custom':
        return '自定义';
      default:
        return type;
    }
  };

  const canEdit = selectedTemplate && !selectedTemplate.isBuiltin;
  const isEditMode = isEditing || isCreating;

  return (
    <div className="grid h-full grid-cols-[300px_1fr] gap-6">
      {/* Template List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>模板列表</CardTitle>
              <CardDescription>管理报告生成模板</CardDescription>
            </div>
            <Button size="sm" onClick={handleCreateNew}>
              <Plus className="mr-2 h-4 w-4" />
              新建
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            {isLoading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">加载中...</div>
            ) : templates.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">暂无模板</div>
            ) : (
              <div className="space-y-1 p-2">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    className={`w-full rounded-md p-3 text-left transition-colors hover:bg-accent ${
                      selectedTemplate?.id === template.id ? 'bg-accent' : ''
                    }`}
                    onClick={() => handleSelectTemplate(template)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{template.name}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {getTemplateTypeLabel(template.type)}
                          </Badge>
                          {template.isBuiltin && (
                            <Badge variant="secondary" className="text-xs">
                              内置
                            </Badge>
                          )}
                          {template.isDefault && (
                            <Badge variant="default" className="text-xs flex items-center gap-1">
                              <Star className="h-3 w-3 fill-current" />
                              默认
                            </Badge>
                          )}
                        </div>
                      </div>
                      {!template.isDefault && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetDefault(template);
                          }}
                          title="设为默认模板"
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Template Editor */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {isCreating ? '新建模板' : isEditing ? '编辑模板' : '模板详情'}
              </CardTitle>
              <CardDescription>
                {isEditMode
                  ? '编辑 Handlebars 模板内容'
                  : selectedTemplate
                    ? '查看模板内容'
                    : '选择一个模板查看详情'}
              </CardDescription>
            </div>
            {selectedTemplate && !isEditMode && (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleCopy}>
                  <Copy className="mr-2 h-4 w-4" />
                  复制
                </Button>
                {canEdit && (
                  <>
                    <Button size="sm" variant="outline" onClick={handleEdit}>
                      <Edit className="mr-2 h-4 w-4" />
                      编辑
                    </Button>
                    <Button size="sm" variant="destructive" onClick={handleDelete}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      删除
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-4 pt-6">
          {!selectedTemplate && !isCreating ? (
            <div className="flex h-[500px] items-center justify-center text-muted-foreground">
              <div className="text-center">
                <FileText className="mx-auto mb-4 h-12 w-12 opacity-20" />
                <p>选择一个模板或创建新模板</p>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="template-name">模板名称</Label>
                <Input
                  id="template-name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  disabled={!isEditMode}
                  placeholder="输入模板名称"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="template-type">模板类型</Label>
                <Select
                  value={formType}
                  onValueChange={(value) => setFormType(value as TemplateType)}
                  disabled={!isCreating}
                >
                  <SelectTrigger id="template-type">
                    <SelectValue placeholder="选择模板类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">周报</SelectItem>
                    <SelectItem value="monthly">月报</SelectItem>
                    <SelectItem value="custom">自定义</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  {isCreating
                    ? '选择模板适用的报告类型'
                    : '模板创建后类型不可修改'}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="template-content">模板内容 (Handlebars)</Label>
                <ScrollArea className="h-[380px] w-full rounded-md border">
                  <textarea
                    id="template-content"
                    className="min-h-[360px] w-full resize-none bg-transparent p-4 font-mono text-sm outline-none"
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    disabled={!isEditMode}
                    placeholder="输入 Handlebars 模板内容..."
                  />
                </ScrollArea>
              </div>

              {isEditMode && (
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleCancel}>
                    取消
                  </Button>
                  <Button onClick={handleSave}>保存</Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TemplateManagement;
