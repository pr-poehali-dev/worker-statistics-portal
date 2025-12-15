import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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

const mockEmployees: Employee[] = [
  { id: 1, name: 'Анна Смирнова', department: 'Продажи', status: 'active', links: 145, reports: 28, warnings: 0, salary: 85000 },
  { id: 2, name: 'Дмитрий Иванов', department: 'Маркетинг', status: 'active', links: 203, reports: 32, warnings: 1, salary: 95000 },
  { id: 3, name: 'Елена Петрова', department: 'Продажи', status: 'vacation', links: 167, reports: 25, warnings: 0, salary: 78000 },
  { id: 4, name: 'Алексей Козлов', department: 'IT', status: 'active', links: 89, reports: 19, warnings: 2, salary: 120000 },
  { id: 5, name: 'Мария Волкова', department: 'HR', status: 'active', links: 112, reports: 24, warnings: 0, salary: 72000 },
  { id: 6, name: 'Сергей Морозов', department: 'Продажи', status: 'active', links: 198, reports: 30, warnings: 0, salary: 92000 },
  { id: 7, name: 'Ольга Новикова', department: 'IT', status: 'inactive', links: 45, reports: 8, warnings: 3, salary: 115000 },
  { id: 8, name: 'Иван Соколов', department: 'Маркетинг', status: 'active', links: 178, reports: 27, warnings: 1, salary: 88000 },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [salaryFilter, setSalaryFilter] = useState('all');

  const filteredEmployees = mockEmployees.filter((employee) => {
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
          <Icon name="Users" size={48} className="text-primary" />
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
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
                  const deptEmployees = mockEmployees.filter(e => e.department === dept);
                  const totalLinks = deptEmployees.reduce((sum, e) => sum + e.links, 0);
                  const maxLinks = Math.max(...['Продажи', 'Маркетинг', 'IT', 'HR'].map(d => 
                    mockEmployees.filter(e => e.department === d).reduce((sum, e) => sum + e.links, 0)
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
                  { label: 'Низкий уровень', range: '< ₽80k', count: mockEmployees.filter(e => e.salary < 80000).length, color: 'bg-yellow-500' },
                  { label: 'Средний уровень', range: '₽80k - ₽100k', count: mockEmployees.filter(e => e.salary >= 80000 && e.salary < 100000).length, color: 'bg-blue-500' },
                  { label: 'Высокий уровень', range: '> ₽100k', count: mockEmployees.filter(e => e.salary >= 100000).length, color: 'bg-green-500' },
                ].map((item) => (
                  <div key={item.label} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.label}</span>
                      <span className="text-muted-foreground">{item.count} сотрудников</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 ${item.color} rounded-full`} style={{ width: `${(item.count / mockEmployees.length) * 100}%` }} />
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
                  {mockEmployees.filter(e => e.warnings > 0).map((employee) => (
                    <div key={employee.id} className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{employee.name}</p>
                        <p className="text-xs text-muted-foreground">{employee.department}</p>
                      </div>
                      <Badge variant="destructive">{employee.warnings}</Badge>
                    </div>
                  ))}
                  {mockEmployees.filter(e => e.warnings > 0).length === 0 && (
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
    </div>
  );
};

export default Index;