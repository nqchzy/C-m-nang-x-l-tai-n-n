# Chạy Dự Án Python Với uv

## Yêu cầu

Cài đặt `uv`:

### Windows

```powershell
winget install astral-sh.uv 
```

Kiểm tra:

```bash
uv --version
```

---

## Chạy Dự Án

1. Clone dự án:

```bash
git clone <repository-url>
cd <project-name>
```

2. Đồng bộ môi trường và cài đặt dependencies:

```bash
uv sync
```

3. Khởi động server:

```bash
uv run uvicorn ./main.py --reload
```

---

## Một số lệnh hữu ích

Cài thêm package:

```bash
uv add <package>
```

Cập nhật dependencies sau khi thay đổi `pyproject.toml`:

```bash
uv sync
```

Chạy file Python:

```bash
uv run python ./main.py
```

