document.addEventListener('DOMContentLoaded', () => {
    const uploadImageBtn = document.getElementById('uploadImageBtn');
    const pickColorBtn = document.getElementById('pickColorBtn');
    const imagePreview = document.getElementById('imagePreview');
    const savedColorsContainer = document.getElementById('savedColors');
    const clearAllBtn = document.getElementById('clearAll');

   
    uploadImageBtn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                imagePreview.src = event.target.result;
            };
            reader.readAsDataURL(file);
        };
        input.click();
    });

    pickColorBtn.addEventListener('click', async () => {
        if (window.EyeDropper) {
            try {
                const eyeDropper = new EyeDropper();
                const result = await eyeDropper.open();
                const selectedColor = result.sRGBHex;
                saveColor(selectedColor); 
            } catch (err) {
                console.error('Error using Eyedropper API:', err);
            }
        } else {
            alert('Your browser does not support the EyeDropper API.');
        }
    });

    const saveColor = (color) => {
        const colorBlockContainer = document.createElement('div');
        colorBlockContainer.classList.add('flex', 'items-center', 'gap-1');

        const colorBlock = document.createElement('div');
        colorBlock.style.backgroundColor = color;
        colorBlock.classList.add('w-8', 'h-8', 'rounded-lg', 'cursor-pointer');
        colorBlock.title = color;

        const colorName = document.createElement('span');
        colorName.textContent = color; 
        colorName.classList.add('text-sm', 'font-semibold');

        colorBlockContainer.appendChild(colorBlock);
        colorBlockContainer.appendChild(colorName);

        colorBlock.addEventListener('click', () => {
            navigator.clipboard.writeText(color);
            alert('Color copied to clipboard: ' + color);
        });

        savedColorsContainer.appendChild(colorBlockContainer);

       
        saveToLocalStorage(color);
    };
    const saveToLocalStorage = (color) => {
        const savedColors = JSON.parse(localStorage.getItem('colors')) || [];
        if (!savedColors.includes(color)) {
            savedColors.push(color);
            localStorage.setItem('colors', JSON.stringify(savedColors));
        }
    };

    const loadSavedColors = () => {
        const savedColors = JSON.parse(localStorage.getItem('colors')) || [];
        savedColors.forEach(color => {
            const colorBlockContainer = document.createElement('div');
            colorBlockContainer.classList.add('flex', 'items-center', 'gap-1');

            const colorBlock = document.createElement('div');
            colorBlock.style.backgroundColor = color;
            colorBlock.classList.add('w-8', 'h-8', 'rounded-lg', 'cursor-pointer');
            colorBlock.title = color;

            const colorName = document.createElement('span');
            colorName.textContent = color;
            colorName.classList.add('text-sm', 'font-semibold');

            colorBlockContainer.appendChild(colorBlock);
            colorBlockContainer.appendChild(colorName);

            colorBlock.addEventListener('click', () => {
                navigator.clipboard.writeText(color);
                alert('Color copied to clipboard: ' + color);
            });

            savedColorsContainer.appendChild(colorBlockContainer);
        });
    };

    clearAllBtn.addEventListener('click', () => {
        savedColorsContainer.innerHTML = ''; 
        localStorage.removeItem('colors'); 
    });
});
