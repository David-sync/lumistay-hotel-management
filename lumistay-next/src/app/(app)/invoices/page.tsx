import { InvoiceTable } from "@/components/invoice-table";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { getInvoices } from "@/lib/repository";
import { formatCurrency } from "@/lib/utils";

export default async function InvoicesPage() {
  const invoices = await getInvoices();
  const unpaid = invoices.filter((invoice) => invoice.trangThai === "Chưa thanh toán");
  const paid = invoices.filter((invoice) => invoice.trangThai === "Đã thanh toán");
  const stats = [
    { label: "Hóa đơn đang mở", value: String(unpaid.length), hint: "Chờ thu tiền", trend: "Cần xử lý", tone: "danger" as const },
    { label: "Giá trị chờ thu", value: formatCurrency(unpaid.reduce((sum, item) => sum + item.tong, 0)), hint: "Tổng chưa thanh toán", trend: "Công nợ", tone: "warn" as const },
    { label: "Đã thanh toán", value: String(paid.length), hint: "Có thể hoàn tất trả phòng", trend: "Đã thu", tone: "good" as const },
  ];

  return (
    <div>
      <PageHeader title="Thu ngân" description="Theo dõi tiền phòng, dịch vụ và hoàn tất trả phòng." />
      <section className="mb-5 grid gap-2 md:grid-cols-3">{stats.map((stat) => <StatCard key={stat.label} stat={stat} />)}</section>
      <InvoiceTable invoices={invoices} />
    </div>
  );
}
