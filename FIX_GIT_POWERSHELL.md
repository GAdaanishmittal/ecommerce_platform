# Fix Embedded Git Repository - PowerShell Commands

## 🔧 PowerShell Commands to Fix the Issue

You're using PowerShell, so here are the correct commands:

### Step 1: Find Nested .git Folders

```powershell
# Find all .git directories
Get-ChildItem -Path . -Filter .git -Recurse -Force -Directory

# Or more detailed:
Get-ChildItem -Path . -Recurse -Force -Directory | Where-Object { $_.Name -eq '.git' }
```

### Step 2: Force Remove from Git Index

```powershell
# Force remove Ecommerce from git tracking
git rm --cached -r -f Ecommerce
```

### Step 3: Remove Nested .git Folders

```powershell
# After Step 1, if you found nested .git folders, remove them:

# Example: If in Ecommerce folder
Remove-Item -Path "Ecommerce\.git" -Recurse -Force

# Or if in target folder
Remove-Item -Path "target\.git" -Recurse -Force

# Remove ALL nested .git folders automatically:
Get-ChildItem -Path . -Recurse -Force -Directory | Where-Object { $_.Name -eq '.git' -and $_.FullName -notlike '*\.git\*' } | ForEach-Object { Remove-Item -Path $_.FullName -Recurse -Force }
```

### Step 4: Re-add Everything

```powershell
git add .
```

### Step 5: Check Status

```powershell
git status
```

### Step 6: Commit and Push

```powershell
git commit -m "Initial commit: Complete Spring Boot Ecommerce Platform with REST API, JWT auth, and comprehensive documentation"

git push -u origin main
```

---

## 🚀 QUICK FIX - All Commands in Sequence

**Copy and paste these commands one by one:**

```powershell
# 1. Find nested .git folders
Get-ChildItem -Path . -Filter .git -Recurse -Force -Directory

# 2. Force remove from Git cache
git rm --cached -r -f Ecommerce

# 3. Remove all nested .git folders (except the root one)
Get-ChildItem -Path . -Recurse -Force -Directory | Where-Object { $_.Name -eq '.git' -and $_.Parent.Name -ne 'Ecommerce_project' } | Remove-Item -Recurse -Force

# 4. Re-add everything
git add .

# 5. Check status
git status

# 6. Commit
git commit -m "Initial commit: Complete Spring Boot Ecommerce Platform with REST API, JWT auth, and comprehensive documentation"

# 7. Push
git push -u origin main
```

---

## 🔄 Alternative: Clean Start (Most Reliable)

If the above doesn't work, start fresh:

```powershell
# 1. Remove root .git folder
Remove-Item -Path ".git" -Recurse -Force

# 2. Remove ALL .git folders in subdirectories
Get-ChildItem -Path . -Recurse -Force -Directory | Where-Object { $_.Name -eq '.git' } | Remove-Item -Recurse -Force

# 3. Initialize fresh Git repo
git init

# 4. Add remote
git remote add origin https://github.com/GAdaanishmittal/ecommerce_platform.git

# 5. Add all files
git add .

# 6. Commit
git commit -m "Initial commit: Complete Spring Boot Ecommerce Platform"

# 7. Set branch to main
git branch -M main

# 8. Push
git push -u origin main
```

---

## ✅ What Each PowerShell Command Does

| Command | Description |
|---------|-------------|
| `Get-ChildItem -Recurse -Force` | Lists all files/folders including hidden |
| `Where-Object` | Filters results |
| `Remove-Item -Recurse -Force` | Deletes folders and all contents |
| `ForEach-Object` | Applies action to each item |

---

**Use the PowerShell commands above, not the cmd.exe ones!**
