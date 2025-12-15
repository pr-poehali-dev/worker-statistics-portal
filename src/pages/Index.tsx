import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

type Employee = {
  id: number;
  name: string;
  department: string;
  status: 'active' | 'vacation' | 'inactive';
  links: number;
  reports: number;
  warnings: number;
  salary: number;
};

const API_URL = 'https://functions.poehali.dev/a2347a7d-29b5-403e-ad47-0db708e07f63';

const Index = () => {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [salaryFilter, setSalaryFilter] = useState('all');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [editForm, setEditForm] = useState<Employee>({
    id: 0,
    name: '',
    department: '',
    status: 'active',
    links: 0,
    reports: 0,
    warnings: 0,
    salary: 0,
  });
  const [addForm, setAddForm] = useState({
    name: '',
    department: 'Продажи',
    status: 'active' as 'active' | 'vacation' | 'inactive',
    links: 0,
    reports: 0,
    warnings: 0,
    salary: 0,
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();
      setEmployees(data.employees);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить сотрудников',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch = employee.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
    const matchesSalary =
      salaryFilter === 'all' ||
      (salaryFilter === 'low' && employee.salary < 80000) ||
      (salaryFilter === 'medium' && employee.salary >= 80000 && employee.salary < 100000) ||
      (salaryFilter === 'high' && employee.salary >= 100000);

    return matchesSearch && matchesDepartment && matchesStatus && matchesSalary;
  });

  const totalLinks = filteredEmployees.reduce((sum, emp) => sum + emp.links, 0);
  const totalReports = filteredEmployees.reduce((sum, emp) => sum + emp.reports, 0);
  const totalWarnings = filteredEmployees.reduce((sum, emp) => sum + emp.warnings, 0);
  const avgSalary = filteredEmployees.length > 0
    ? Math.round(filteredEmployees.reduce((sum, emp) => sum + emp.salary, 0) / filteredEmployees.length)
    : 0;

  const handleEditClick = (employee: Employee) => {
    setEditingEmployee(employee);
    setEditForm(employee);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      
      if (response.ok) {
        await fetchEmployees();
        setIsEditDialogOpen(false);
        toast({
          title: 'Сотрудник обновлен',
          description: `Данные ${editForm.name} успешно сохранены`,
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить изменения',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteEmployee = async (id: number) => {
    const employee = employees.find(emp => emp.id === id);
    try {
      const response = await fetch(`${API_URL}?id=${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        await fetchEmployees();
        toast({
          title: 'Сотрудник удален',
          description: `${employee?.name} удален из системы`,
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить сотрудника',
        variant: 'destructive',
      });
    }
  };

  const handleAddEmployee = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      });
      
      if (response.ok) {
        await fetchEmployees();
        setIsAddDialogOpen(false);
        setAddForm({
          name: '',
          department: 'Продажи',
          status: 'active',
          links: 0,
          reports: 0,
          warnings: 0,
          salary: 0,
        });
        toast({
          title: 'Сотрудник добавлен',
          description: `${addForm.name} успешно добавлен в систему`,
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить сотрудника',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', text: string }> = {
      active: { variant: 'default', text: 'Активен' },
      vacation: { variant: 'secondary', text: 'Отпуск' },
      inactive: { variant: 'outline', text: 'Неактивен' },
    };
    const { variant, text } = variants[status] || variants.active;
    return <Badge variant={variant}>{text}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Управление персоналом</h1>
            <p className="text-muted-foreground mt-2">Мониторинг и аналитика сотрудников</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} size="lg" className="gap-2">
            <Icon name="UserPlus" className="h-5 w-5" />
            Добавить сотрудника
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Всего ссылок</CardTitle>
              <Icon name="Link" className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{totalLinks}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {filteredEmployees.length} сотрудников
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Отчеты сданы</CardTitle>
              <Icon name="FileText" className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{totalReports}</div>
              <p className="text-xs text-muted-foreground mt-1">
                За текущий месяц
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Предупреждения</CardTitle>
              <Icon name="AlertTriangle" className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{totalWarnings}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Требуют внимания
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Средняя зарплата</CardTitle>
              <Icon name="DollarSign" className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">₽{avgSalary.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                В месяц
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Фильтры</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Поиск</label>
                <div className="relative">
                  <Icon name="Search" className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Имя сотрудника..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Отдел</label>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все отделы</SelectItem>
                    <SelectItem value="Продажи">Продажи</SelectItem>
                    <SelectItem value="Маркетинг">Маркетинг</SelectItem>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Статус</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все статусы</SelectItem>
                    <SelectItem value="active">Активен</SelectItem>
                    <SelectItem value="vacation">Отпуск</SelectItem>
                    <SelectItem value="inactive">Неактивен</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Уровень зарплаты</label>
                <Select value={salaryFilter} onValueChange={setSalaryFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все уровни</SelectItem>
                    <SelectItem value="low">Низкий (&lt;80k)</SelectItem>
                    <SelectItem value="medium">Средний (80k-100k)</SelectItem>
                    <SelectItem value="high">Высокий (&gt;100k)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="shadow-lg lg:col-span-2">
            <CardHeader>
              <CardTitle>Список сотрудников</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Сотрудник</TableHead>
                      <TableHead>Отдел</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead className="text-center">Ссылки</TableHead>
                      <TableHead className="text-center">Отчеты</TableHead>
                      <TableHead className="text-center">Предупреждения</TableHead>
                      <TableHead className="text-right">Зарплата</TableHead>
                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                          Сотрудники не найдены
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEmployees.map((employee) => (
                        <TableRow key={employee.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{employee.name}</TableCell>
                          <TableCell>{employee.department}</TableCell>
                          <TableCell>{getStatusBadge(employee.status)}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="font-mono">
                              {employee.links}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="font-mono">
                              {employee.reports}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            {employee.warnings > 0 ? (
                              <Badge variant="destructive" className="font-mono">
                                {employee.warnings}
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="font-mono">
                                0
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-mono font-semibold">
                            ₽{employee.salary.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditClick(employee)}
                                className="h-8 w-8 p-0"
                              >
                                <Icon name="Pencil" className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteEmployee(employee.id)}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              >
                                <Icon name="Trash2" className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="TrendingUp" className="h-5 w-5 text-primary" />
                  Производительность отделов
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {['Продажи', 'Маркетинг', 'IT', 'HR'].map((dept) => {
                  const deptEmployees = employees.filter(e => e.department === dept);
                  const totalLinks = deptEmployees.reduce((sum, e) => sum + e.links, 0);
                  const maxLinks = Math.max(...['Продажи', 'Маркетинг', 'IT', 'HR'].map(d => 
                    employees.filter(e => e.department === d).reduce((sum, e) => sum + e.links, 0)
                  ));
                  const percentage = (totalLinks / maxLinks) * 100;
                  
                  return (
                    <div key={dept} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{dept}</span>
                        <span className="text-muted-foreground">{totalLinks} ссылок</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="BarChart3" className="h-5 w-5 text-primary" />
                  Распределение зарплат
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'Низкий уровень', range: '< ₽80k', count: employees.filter(e => e.salary < 80000).length, color: 'bg-yellow-500' },
                  { label: 'Средний уровень', range: '₽80k - ₽100k', count: employees.filter(e => e.salary >= 80000 && e.salary < 100000).length, color: 'bg-blue-500' },
                  { label: 'Высокий уровень', range: '> ₽100k', count: employees.filter(e => e.salary >= 100000).length, color: 'bg-green-500' },
                ].map((item) => (
                  <div key={item.label} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.label}</span>
                      <span className="text-muted-foreground">{item.count} сотрудников</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 ${item.color} rounded-full`} style={{ width: `${employees.length > 0 ? (item.count / employees.length) * 100 : 0}%` }} />
                      <span className="text-xs text-muted-foreground">{item.range}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="AlertCircle" className="h-5 w-5 text-destructive" />
                  Предупреждения
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {employees.filter(e => e.warnings > 0).map((employee) => (
                    <div key={employee.id} className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{employee.name}</p>
                        <p className="text-xs text-muted-foreground">{employee.department}</p>
                      </div>
                      <Badge variant="destructive">{employee.warnings}</Badge>
                    </div>
                  ))}
                  {employees.filter(e => e.warnings > 0).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Нет активных предупреждений
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Редактировать сотрудника</DialogTitle>
            <DialogDescription>
              Внесите изменения в данные сотрудника
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Имя
              </Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">
                Отдел
              </Label>
              <Select
                value={editForm.department}
                onValueChange={(value) => setEditForm({ ...editForm, department: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Продажи">Продажи</SelectItem>
                  <SelectItem value="Маркетинг">Маркетинг</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Статус
              </Label>
              <Select
                value={editForm.status}
                onValueChange={(value: 'active' | 'vacation' | 'inactive') => 
                  setEditForm({ ...editForm, status: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Активен</SelectItem>
                  <SelectItem value="vacation">Отпуск</SelectItem>
                  <SelectItem value="inactive">Неактивен</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="links" className="text-right">
                Ссылки
              </Label>
              <Input
                id="links"
                type="number"
                value={editForm.links}
                onChange={(e) => setEditForm({ ...editForm, links: Number(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reports" className="text-right">
                Отчеты
              </Label>
              <Input
                id="reports"
                type="number"
                value={editForm.reports}
                onChange={(e) => setEditForm({ ...editForm, reports: Number(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="warnings" className="text-right">
                Предупреждения
              </Label>
              <Input
                id="warnings"
                type="number"
                value={editForm.warnings}
                onChange={(e) => setEditForm({ ...editForm, warnings: Number(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="salary" className="text-right">
                Зарплата
              </Label>
              <Input
                id="salary"
                type="number"
                value={editForm.salary}
                onChange={(e) => setEditForm({ ...editForm, salary: Number(e.target.value) })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleSaveEdit}>
              Сохранить изменения
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Добавить сотрудника</DialogTitle>
            <DialogDescription>
              Заполните данные нового сотрудника
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-name" className="text-right">
                Имя
              </Label>
              <Input
                id="add-name"
                value={addForm.name}
                onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                className="col-span-3"
                placeholder="Введите полное имя"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-department" className="text-right">
                Отдел
              </Label>
              <Select
                value={addForm.department}
                onValueChange={(value) => setAddForm({ ...addForm, department: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Продажи">Продажи</SelectItem>
                  <SelectItem value="Маркетинг">Маркетинг</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-status" className="text-right">
                Статус
              </Label>
              <Select
                value={addForm.status}
                onValueChange={(value: 'active' | 'vacation' | 'inactive') => 
                  setAddForm({ ...addForm, status: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Активен</SelectItem>
                  <SelectItem value="vacation">Отпуск</SelectItem>
                  <SelectItem value="inactive">Неактивен</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-links" className="text-right">
                Ссылки
              </Label>
              <Input
                id="add-links"
                type="number"
                value={addForm.links}
                onChange={(e) => setAddForm({ ...addForm, links: Number(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-reports" className="text-right">
                Отчеты
              </Label>
              <Input
                id="add-reports"
                type="number"
                value={addForm.reports}
                onChange={(e) => setAddForm({ ...addForm, reports: Number(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-warnings" className="text-right">
                Предупреждения
              </Label>
              <Input
                id="add-warnings"
                type="number"
                value={addForm.warnings}
                onChange={(e) => setAddForm({ ...addForm, warnings: Number(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-salary" className="text-right">
                Зарплата
              </Label>
              <Input
                id="add-salary"
                type="number"
                value={addForm.salary}
                onChange={(e) => setAddForm({ ...addForm, salary: Number(e.target.value) })}
                className="col-span-3"
                placeholder="Введите сумму"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleAddEmployee}>
              Добавить сотрудника
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;